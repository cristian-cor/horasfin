jest.mock("passport-jwt", () => {
    const original = jest.requireActual("passport-jwt");
    original.Strategy.prototype.authenticate = function () {
        this.success(verify(), {});
    };
    return original;
});
export const verify = jest.fn();
