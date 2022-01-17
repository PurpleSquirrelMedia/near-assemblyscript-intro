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