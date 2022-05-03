const sinon = require('sinon')
const chai = require('chai').should()

const calculate = (x, y, callback) => {
    callback(null, Math.sqrt(x*x + y*x))
}

describe("Test:", () => {
    it("should exec", () => {
        const callback = sinon.spy()
        calculate(3,3,callback)

        callback.called.should.be.true
    })
})
