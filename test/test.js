require('mocha')

var requireSubvert = require('require-subvert')(__dirname)

var chai = require('chai'),
  sinon = require('sinon'),
  request = require('request')

var should = chai.should()

chai.use(require('chai-interface'))

var res = {
  body: {
    content: {
      data: ''
    },
    meta: {}
  }
}

sinon.stub(request, 'post').yields(null, res, res.body)
var stub = sinon.stub()
requireSubvert.subvert('random-revisitor', stub)
stub.yields(null, 'hello')

describe('rando-revisit-service', function () {
  var rando = require('../')

  it('returns modified payload when successful', function () {
    res.body.content.data = 'responsedata'

    var payload = {
      content: {
        data: 'data:foo;base64,' + 'hello'.toString('base64')
      },
      meta: {}
    }

    rando(payload, function (err, newPayload) {
      should.not.exist(err)

      newPayload.should.have.interface({
        content: {
          data: String
        },
        meta: Object
      })

      newPayload.content.data.should.be.string('responsedata')
    })

  })

  it('returns original payload when body.content is missing', function () {
    res.body.content = {}

    var payload = {
      content: {
        data: 'data:foo;base64,' + 'hello'.toString('base64')
      },
      meta: {}
    }

    rando(payload, function (err, newPayload) {
      should.not.exist(err)

      newPayload.content.data.should.be.string('hello')
    })

  })

})
