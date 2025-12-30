import { Cashfree, CFEnvironment } from "cashfree-pg";

Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;

// If CASHFREE_ENV is "TEST", this evaluates to false and uses SANDBOX
Cashfree.XEnvironment = process.env.CASHFREE_ENV === "PROD"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX;

export { Cashfree };