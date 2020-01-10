var Promise = require("bluebird");
var config = require("./config");
var redis = require("./lib/RedisClient.js").createClient(config.redis);

/*
function updateRedisWithData(visitorId,data) {
	return new Promise(function(resolve, reject){
		redis.hmset("data:"+visitorId, 'visitorID',visitorId,'time',new Date(), 'data', JSON.stringify(data), function(err,reply){
		console.log('Inserted Data --------',reply);
		resolve(reply);
	});
	})
	
}*/
function getRedisKeys(key) {
    return new Promise(function(resolve, reject) {
        redis.keys(key + "*", function(err, keys) {
            if (err) reject(err);
            else if (keys) {
                resolve(keys);
            } else resolve(undefined);
        });
    });
}

function getRedisSingleKey(key, param) {
    return new Promise(function(resolve, reject) {
        redis.keys(key + ":" + param, function(err, keys) {
            if (err) reject(err);
            else if (keys) {
                resolve(keys);
            } else resolve(undefined);
        });
    });
}

function updateRedisWithData(visitorId, data) {
    return new Promise(function(resolve, reject) {
        redis.hmset(
            "visitorId:" + visitorId,
            "time",
            new Date(),
            "data",
            JSON.stringify(data),
            function(err, reply) {
                console.log("Inserted Data --------", reply);
                resolve(reply);
            }
        );
    });
}

function updateRedisWithUserData(conversationId, data) {
    return new Promise(function(resolve, reject) {
        redis.hmset(
            "conversationId:" + conversationId,
            "time",
            new Date(),
            "data",
            JSON.stringify(data),
            function(err, reply) {
                console.log("Inserted Data --------", reply);
                resolve(reply);
            }
        );
    });
}

function updateRedisconnectedAgent(convid, data) {
    return new Promise(function(resolve, reject) {
        redis.hmset("convid:" + convid, "time", new Date(), "data", data, function(
            err,
            reply
        ) {
            console.log("Inserted Data --------", reply);
            resolve(reply);
        });
    });
}

function insertLPToken(convid, token) {
    return new Promise(function(resolve, reject) {
        redis.hmset("token:" + convid, "time", new Date(), "data", token, function(
            err,
            reply
        ) {
            console.log("Inserted LP token --------", reply);
            resolve(reply);
        });
    });
}

function setTtl(visitorOrGroupId, hashType) {
    redis.expire(hashType + ":" + visitorOrGroupId, 14400);
    console.log("TTL set successfully", );
}


function getRedisData(key) {
    return new Promise(function(resolve, reject) {
        redis.hgetall(key, function(err, object) {
            if (err) reject(err);
            else if (object) {
                var resp;
                try {
                    resp = JSON.parse(object.data);
                } catch (e) {
                    resp = object.data;
                }
                resolve(resp);
            } else resolve(undefined);
        });
    });
}

function getRedisDataId(key) {
    return new Promise(function(resolve, reject) {
        redis.hgetall(key, function(err, object) {
            if (err) reject(err);
            else if (object) {
                resolve(object);
            } else resolve(undefined);
        });
    });
}

function getRedisTTL(key) {
    return new Promise(function(resolve, reject) {
        redis.ttl(key, function(err, object) {
            if (err) reject(err);
            else if (object) {
                resolve(object);
            } else resolve(undefined);
        });
    });
}

function updateRedisById(key) {
    return new Promise(function(resolve, reject) {
        redis.expire(key, 28800, function(err, data) {
            resolve(data);
        });
    });
}

function deleteRedisData(key) {
    redis.del(key, function(err, reply) {
        console.log("deleted data --------", reply);
    });
}
module.exports.updateRedisWithData = updateRedisWithData;
/*module.exports.updateRedisWithEntry = updateRedisWithEntry;*/
module.exports.updateRedisWithUserData = updateRedisWithUserData;
module.exports.updateRedisconnectedAgent = updateRedisconnectedAgent;
module.exports.getRedisData = getRedisData;
module.exports.deleteRedisData = deleteRedisData;
module.exports.setTtl = setTtl;
module.exports.getRedisDataId = getRedisDataId;
module.exports.getRedisTTL = getRedisTTL;
module.exports.updateRedisById = updateRedisById;
module.exports.insertLPToken = insertLPToken;
module.exports.getRedisKeys = getRedisKeys;
module.exports.getRedisSingleKey = getRedisSingleKey;
