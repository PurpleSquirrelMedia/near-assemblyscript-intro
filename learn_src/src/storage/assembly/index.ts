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
