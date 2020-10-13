var assert = require("assert");
var server = require("../server");
describe('server', function() {
    describe('#time()', function() {
        it('Return the true time', function() {
            assert.notEqual('2020-10-10', server.time());
            //assert.equal(-1, [1,2,3].indexOf(0));
        });
    });
});

describe('createDesk', function() {
    describe('#createDeskList()', function() {
        it('createDeskList', function() {
            server.GameServer(8001);
            assert.ok(server.createDeskList(50));
        });
    });
});

describe('proto', function() {
    describe('#GameServer()', function() {
        it('GameServer', function() {
            if(assert.ifError(server.GameServer(8001))) {
                assert.ok(false)
            }
            else {
                assert.ok(true)
            }
        });
    });
});



