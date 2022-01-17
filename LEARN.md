# NEAR AssemblyScript project setup
Hello there! in this quest, we will learn how to set up an AssemblyScript project. Developers write smart contracts over NEAR using either Rust or AssemblyScript. We will show you how to write an AssemblyScript contract, test it, deploy it, and interact with it. Cool, right? Let's see.

## The setup:
So let's cut to the chase right away, here is a list of things you will need to do every time you want to set up a project. Well, I am sure you will do them once and then just use what you have as a template. Come on my lazy geek friend, I know you've already decided that.

1 - ``` mkdir your-project-name ```

2 - ``` cd your-project-name ```

3 - ``` yarn init --yes ```

4 - ``` yarn add -D near-sdk-as ```

Install the NEAR AssemblyScript SDK. 

5 - While you are in your project's root, add this to your package.json:

```json

"scripts": {
    "test": "yarn asp -f unit.spec",
    "build": "asb --target debug"
},                
```

Commands for testing and building.

6 - ``` touch asconfig.json ```

7 - In asconfig.json, add the following:
    
```json
 {
    "workspaces": [
        "src/storage"
    ]
}
```
This is because we will write a storage contract later. You will change this according to your workspaces.

8 - ``` touch as-pect.config.js ``` and add:

```js
module.exports = require("near-sdk-as/imports");
module.exports.include.push("**/*.unit.spec.ts");
```
Use imports from the SDK, and incluse the testing stuff.

9 - ``` mkdir src ```

10 - ``` cd src ```

11 - ``` touch tsconfig.json ``` and add:

```json 
{
    "extends": "../node_modules/assemblyscript/std/assembly.json",
    "include": [
        "./**/*.ts"
    ]
}
```

12 - ``` touch as_types.d.ts ``` and add:

```json
/// <reference types="near-sdk-as/assembly/as_types" />
```
So your contract recognizes datatypes.

13 - ``` mkdir storage ```

14 - ``` cd storage ```

15 - ``` touch asconfig.json ``` and add:

```json
{
  "extends": "near-sdk-as/asconfig.json"
}
```
Provides what is necessary for writing contracts. 

16 - ``` mkdir assembly``` 

17 - ``` cd assembly```

18 - ``` touch index.ts ```

Where your contract will live.

19 - ``` cd .. ```

Back off a bit!

20 - ``` mkdir __tests__ ```

21 - ``` cd __tests___ ```

22 - ``` touch index.unit.spec.ts ```

Where your tests will  live.

22 - ``` touch as_pect.d.ts ``` and add:

```js
/// <reference types="@as-pect/assembly/types/as-pect" />
```

## Writing a simple contract and testing it:
Our smart contract will live in index.ts, take a look at the following:

```js
import { storage, context, u128 } from "near-sdk-as";

export function setNumber(num: u32): boolean {
    assert(context.attachedDeposit == u128.mul(
        u128.from("1000000000000000000000000"),
        u128.from(2))
    )
    storage.set<u32>("number", num);
    return true;
}

export function getNumber(): u32 {
    return storage.getPrimitive<u32>("number", 0);
}
```

Try to read it carefully. Did you figure out what is happening?

This contract has only two simple functions: a setter, and a getter. Note that users have to send 2 NEARs to change the number.

Now run ``` yarn build ```, done? Can you see that build directory now? This contains the actual WebAssembly file that "talks" to the NEAR blockchain. 

How about we test this thing?
Go to index.unit.spec.ts, here is where unit tests go. Add the following:

```js
import * as contract from "../assembly";
import {u128, VMContext} from "near-sdk-as";

describe("testing the storage", () => {
    it("should store a number", () => {
        const ONE_NEAR = u128.from("1000000000000000000000000");
        const TO_BE_SENT = u128.mul(ONE_NEAR, u128.from(2));
        VMContext.setSigner_account_id("alice.testnet");
        VMContext.setAttached_deposit(TO_BE_SENT);
        contract.setNumber(1);
        const number = contract.getNumber();
        expect(number).toBe(1);
    })
})
```

Not really complicated, huh? We called setNumber() with the account "alice.testnet". This can really be just a random string, but I did it this way for demonstration purposes.

Also, note that Alice sent 2 NEARs along with the call. Fake NEARs, of course, we are not even on a testnet. We are just playing around with a VM that pretends to be the Blockchain. 

Cool, now run ```yarn test```. Beautiful, right?
Try to make the test fail on purpose. Like, send 1 NEAR. Or, you know, setNumber(1) and expect it to be 2. 

## Deploying the contract - doing function calls:
Remember that storage.wasm file we mentioned before? This will help us deploy our contract:
Run this command in your project root:

``` near dev-deploy ./build/debug/storage.wasm ```

This will deploy our contract to the local network. Do you see your contract's account id?

Looks like this: ```dev-***-***``` . We will use this id to call the contract, so run the following:
``` export Contract=dev-***-*** ```. You know, from now on when we write ```contract``` we mean ``` dev-***-*** ```. Do you have a testnet wallet (explained in a previous quest)?

If you do not, please take a look at that quest. Now, let's login so we can have fun with our functions! Run ``` near login ```. Your browser should pop up telling you if you trust this app. Confirm and get back to your terminal. I am waiting.

Functions fall into two categories: view, and change. A function either reads from the state, or changes it.
Now run this:

``` near view $Contract getNumber ```

You got zero, right? Let's change this:

``` near call $Contract setNumber '{"num" : 1}' --accountId you.testnet --amount 2 ```

Now we are calling setNumber with one as a value and two NEARs as an attached deposit. Note that you have to replace ``` you.testnet ``` with your id. Now do that view call again, did you get One?

## And that is it!
You just did it! You now know how to work with AssemblyScript contracts on NEAR. Congrats and happy coding.

