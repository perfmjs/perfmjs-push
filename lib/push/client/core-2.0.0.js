!(function() {
    "use strict";
    var _namespace = function() {
        var a = arguments, o, i = 0, j, d, arg;
        for (; i < a.length; i++) {
            o = window;
            arg = a[i];
            if (arg.indexOf('skyjs') !== 0) {
                arg = 'skyjs.' + arg;
            }
            if (arg.indexOf('.')) {
                d = arg.split('.');
                for (j = (d[0] === 'window') ? 1 : 0; j < d.length; j++) {
                    o[d[j]] = o[d[j]] || {};
                    o = o[d[j]];
                }
            } else {
                o[arg] = o[arg] || {};
            }
        }
    };
    _namespace('skyjs');
    skyjs.currentDomain = "";
    skyjs.utils = {
    	namespace: _namespace,
        isBrowserSupport: function() {
            return !this.isNodeJSSupport();
        },
        isNodeJSSupport: function() {
            if (typeof module !== 'undefined' && module.exports) {
                return true;
            }
            return false;
        },
        isAmdSupport: function() {
            return (typeof define === "function" && define.amd && define.amd['async']);
        },
        isH5Support: function() {
            return '__proto__' in {};
        },
        isObject: function(obj) {
            return obj === Object(obj);
        },
        keys: function(obj) {
            if (!this.isObject(obj)) return [];
            if (Object.keys) return Object.keys(obj);
            var keys = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    keys[keys.length] = key;
                }
            }
            return keys;
        },
        _fastBind: function(fn, thisContext) {
            var args,
                slice = Array.prototype.slice,
                startNum = arguments.length > 2 ? 2 :arguments.length;

            args = slice.call(arguments,startNum);
            return function () {
                Array.prototype.push.apply(args,slice.call(arguments))
                return fn.apply(thisContext, args);
            }
        },
        forEach: function(subject, fn, thisContext) {
            var length = subject.length, i,
                iterator = arguments.length > 2 ? this._fastBind(fn, thisContext) : fn;
            for (i = 0; i < length; i++) {
                iterator(subject[i], i, subject);
            }
        },
        toNumber: function(obj) {
            return ~~obj; //int型数字本身或0: "null,undefined,false,0,'',NaN,非数字的字符串"
        },
        toBoolean: function(obj) {
            return !!obj; //these is false: "null,undefined,false,0,'',NaN"
        },
    	//以下方法实现都是来自jquery1.8.2的对应方法:_type,_isFunction,_isArray,_isWindow,_isPlainObject,_extend
    	_class2type: undefined,
    	type: function(obj) {
    		if (this._class2type === undefined) {
    			var _class2type = this._class2type = {};
    		    this.forEach("Boolean Number String Function Array Date RegExp Object".split(" "), function(item, index) {
    		    	_class2type["[object " + item + "]"] = item.toLowerCase();
    		    });
    		}
    		return obj == null ? String(obj) : this._class2type[Object.prototype.toString.call(obj)] || "object";
    	},
    	isString: function(obj) {
    		return typeof obj == "string";
    	},
    	isFunction: function(obj) {
    		return this.type(obj) === "function";
    	},
    	isArray: Array.isArray || function(obj) {
    		return this.type(obj) === "array";
    	},
    	isWindow: function(obj) {
    		return obj != null && obj == obj.window;
    	},
    	_isPlainObject: function(obj) {
    		var core_hasOwn = Object.prototype.hasOwnProperty;
    		if (!obj || this.type(obj) !== "object" || obj.nodeType || this.isWindow(obj)) {
    			return false;
    		}
    		try {
    			if (obj.constructor &&
    				!core_hasOwn.call(obj, "constructor") &&
    				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
    				return false;
    			}
    		} catch (e) {
    			return false;
    		}
    		var key;
    		for (key in obj){}
    		return key === undefined || core_hasOwn.call(obj, key);
    	},
    	extend: function() {
    		var options, name, src, copy, copyIsArray, clone,
    		target = arguments[0] || {},
    		i = 1,
    		length = arguments.length,
    		deep = false;
        	if (typeof target === "boolean") {
        		deep = target;
        		target = arguments[1] || {};
        		i = 2;
        	}
        	if (typeof target !== "object" && !this.isFunction(target)) {
        		target = {};
        	}
        	if (length === i) {
        		target = this;
        		--i;
        	}
        	for (; i < length; i++) {
        		if ( (options = arguments[ i ]) != null ) {
        			for (name in options) {
        				src = target[name];
        				copy = options[name];
        				if (target === copy) {
        					continue;
        				}
        				if (deep && copy && ( this._isPlainObject(copy) || (copyIsArray = this.isArray(copy)))) {
        					if (copyIsArray) {
        						copyIsArray = false;
        						clone = src && this.isArray(src) ? src : [];
        					} else {
        						clone = src && this._isPlainObject(src) ? src : {};
        					}
        					target[name] = this.extend(deep, clone, copy);
        				} else if ( copy !== undefined ) {
        					target[name] = copy;
        				}
        			}
        		}
        	}
        	return target;
        },
    	trim: String.prototype.trim && !String.prototype.trim.call("\uFEFF\xA0") ?
			function(text) {
				return text==null?"":String.prototype.trim.call( text );
			} : function(text) {
				return text==null?"":(text + "").replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
		},
    	now: function() {
    		return (new Date).getTime();
    	},
    	error: function(msg) {
    		throw new Error(msg);
    	},
    	parseJSON: function(data) {
    		if (!data || typeof data !== "string") {
    			return null;
    		}
    		data = this.trim(data);
    		if (window.JSON && window.JSON.parse) {
    			return window.JSON.parse(data);
    		}
    		if ( /^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, "@")
    			.replace(/"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g, "]")
    			.replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
    			return (new Function("return " + data))();
    		}
    		this.error("Invalid JSON: " + data);
    	},
    	debugJSON: function(o) {
    		//用于在ie8+和ff3.5+浏览器下开发调试
    		if (typeof(JSON) == 'object' && JSON.stringify) {
	            return JSON.stringify(o);
    		}
    		return "null";
    	},
        /**
         * 合并JSON对象或数组(second)到第1个数组(first)中
         */
    	merge: function(first, second) {
    		var l = second.length, i = first.length, j = 0;
    		if (typeof l === "number") {
    			for (; j < l; j++) {
    				first[i++] = second[j];
    			}
    		} else {
    			while (second[j] !== undefined) {
    				first[i++] = second[j++];
    			}
    		}
    		first.length = i;
    		return first;
    	},
    	fmtJSONMsg: function(jsonData) {
    		//json格式消息与响应的JSONMessage对象保持一致, status: 成功-success, 失败-fail
    		var result, jsonMessage = {status:"fail",code:'0',msg:'',result:{}};
    		try {
    			if (typeof jsonData === 'string') {
                    if (typeof(JSON) == 'object' && JSON.parse) {
                        result = JSON.parse(jsonData);
                    } else {
                        result = eval("(" + jsonData + ")");
                    }
    			} else {
    				result = jsonData;
    			}
    			//对不规范响应内容进行处理
    			if (result != undefined && result.status == undefined) {
    				jsonMessage.status = "success";
    				jsonMessage.code = "0";
    				jsonMessage.msg = "";
    				jsonMessage.result = result;
    			}  else if (result != undefined) {
    				jsonMessage = result;
    			}
    		} catch(err) {
                //服务器响应失败，错误代码：XXX，请稍后重试或联系我们的客服！
                //TODO 可将err.description||err.toString()||''发送给日志服务器分析
                jsonMessage = {status:"fail",code:'0',msg:"服务器响应失败，请稍后重试或联系我们的客服！",result:{}};
    		}
    		return jsonMessage || {status:"fail",code:'0',msg:'',result:{}};
    	},
        aop: function(context, orig, before, after) {
            var _self = this, aopFunc = function() {
                var args, result;
                context = context || this;
                if (before && typeof before === 'function') {
                    //可修改传入参数
                    args = before.apply(context, arguments);
                    //如果返回false, 则停止执行
                    if (typeof args !== 'undefined') {
                        return args;
                    }
                }
                //如果before返回一个数组，则用来替换原有参数
                args = _self.isArray(args) ? args : arguments;
                //调用原对象的原方法
                result = orig.apply(context, args);
                if (after && typeof after === 'function') {
                    Array.prototype.unshift.call(args, result);
                    //可修改返回结果
                    result = after.apply(context, args) || result;
                }
                return result;
            };
            return aopFunc;
        },
        nextTick: (typeof module !== 'undefined' && module.exports) ? function(f, v) {
            process.nextTick(function() {f(v);});
        } : function(f, v) {setTimeout(function() {f(v);},0);},
    	end: 0
    };
    //skyjs插件开发接口
    skyjs.plugin = function(meta, fn) {
		var name = skyjs.utils.isString(meta) ? meta : meta['name'];
		fn = skyjs.utils.isFunction(meta) ? meta : fn;
		if (!skyjs.utils.isFunction(fn)) {
            throw "Plugin fn required!";
        }
        if (!skyjs.plugins) {
            skyjs.plugins = {};
        }
        if (skyjs.plugins[name]) {
            throw "Plugin name [" + name + " ] already exists!";
        }
		if (name && fn) {
            skyjs.plugins[name] = fn;
        }
        fn(skyjs);
	};
    skyjs.ready = function(callback) {
        if (skyjs.utils.isFunction(callback)) {
            skyjs.loadRes.ready(document, function () {
                callback(skyjs, skyjs.app.newInstance());
            });
        }
    };
})();
skyjs.plugin('sysConfig', function($$) {
    $$.utils.namespace('sysConfig');
    $$.sysConfig.events = {
        moduleIsReady: 'skyjs.ready',
        end:0
    };
});
/**
 * 原生态js的OO框架抽象基类, 默认不自动实例化对象
 * @date 2014-08-30
 */
!(function($$) {
	$$ = $$ || window;
	$$.base = function(name, prototype, parentPrototype, parentDefaults) {
        //name必须全局唯一
        if (name.indexOf('base.') < 0) {
            name = 'base.' + name;
        }
		var namespace = name.split(".").slice(0, name.split(".").length - 1).join('.');
		name = name.split(".")[name.split(".").length - 1];
		var spaceLen = namespace.split(".").length, spaces = namespace.split(".");
		for (var i = 0; i < spaceLen; i++) {
			$$[namespace] = (i < 1)?$$[spaces[0]]:$$[namespace][spaces[i]];
            parentDefaults = $$.utils.extend({}, parentDefaults, $$[namespace].defaults);
            parentPrototype = $$.utils.extend(true, {}, parentPrototype, $$[namespace].prototype);
		}
		$$[namespace] = $$[namespace] || {};
        if ($$[name]) {
            throw new Error('base module [' + name + '] already exists!')
        }
        $$[name] = $$.base[name] = $$[namespace][name] = function(callInitFunc, options) {
			callInitFunc = (callInitFunc === undefined)?true:callInitFunc;
			this.options = $$.utils.extend({}, parentDefaults, $$[namespace][name].defaults, options);
			(callInitFunc && this.init());
            if (!this.options['scope']) {
                this.options['scope'] = 'singleton';
            }
			if (this.options['scope'] === 'singleton') {
				$$[name]['instance'] = this;
			}
		};
        $$[namespace][name].getName = function() {return name;};
		$$[namespace][name].newInstance = function(initParam, options) {
			if ($$[name]['instance']) {
				return $$[name]['instance'];
			}
			var _inst = new $$[namespace][name](false, options); _inst.init(initParam);
			return _inst;
		};
		$$[namespace][name].prototype = $$.utils.extend(true, {}, parentPrototype, prototype);
		$$[namespace][name].prototype._super = function(funcName, options) {
            //FIXME base父类的第一级子类中（base.ssqModule)不可以执行重写的方法：如this._super('init', options);
            //FIXME this._super('init', options); 只能存在于最终实例化的那1个子类中
			return parentPrototype[funcName].call(this, options);
		};
	};
	$$.base.prototype = {
		init: function(initParam) {
			return this;
		},
		option: function(key, value) {
            if (typeof key === "string") {
                if (typeof value === 'undefined') {
                    return this.options[key];
                } else {
                    return this.options[key] = value;
                }
            }
		}
	};
	/*
	 * 以下是公共的配置,可被子类覆盖.以免引起混乱,这些配置变量不应在除父类和子类的第三方类中引用
	 * scope: singleton | prototype, the default value is singleton
	 */
	$$.base.defaults = {
		scope: 'singleton',
		end: 0
	};
})(skyjs);
/*
 * joquery: 类似linq操作数组集合
 */
skyjs.plugin('joquery', function($$) {
	$$.base("joquery", {
		init: function() {
			if (arguments === undefined) return this;
			//copy传进来的入参数组
			this.items = arguments[0].slice();
			return this;
		},
        toArray: function() {return this.items;},
        /**
         * where条件
         * @param clause 条件表达式
         * @param lazySearch： true-找到一个符合条件的记录后不再往后找，false-一直找到最后
         * @returns {*}
         */
        where: function(clause, lazySearch) {
            var newArray = new Array();
            for (var index = 0; index < this.items.length; index++) {
                if (clause(this.items[index], index)) {
                    newArray[newArray.length] = this.items[index];
                    if (lazySearch) {
                        break;
                    }
                }
            }
            return $$.joquery.newInstance(newArray);
        },
        select: function(clause) {
            var newArray = new Array();
            for (var i = 0; i < this.items.length; i++) {
                if (clause(this.items[i])) {
                    newArray[newArray.length] = this.items[i];
                }
            }
            return $$.joquery.newInstance(newArray);
        },
        orderBy: function(clause) {
            return $$.joquery.newInstance(this.items.slice().sort(function(a, b) {
                    var x = clause(a);
                    var y = clause(b);
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }));
        },
        orderByDesc: function(clause) {
            return $$.joquery.newInstance(this.items.slice().sort(function(a, b) {
                var x = clause(b);
                var y = clause(a);
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }));
        },
        selectMany: function(clause) {
            var r = new Array();
            for (var i = 0; i < this.items.length; i++) {
                r = r.concat(clause(this.items[i]));
            }
            return $$.joquery.newInstance(r);
        },
        count: function(clause) {
            if (clause == null)
                return this.items.length;
            else
                return this.where(clause).items.length;
        },
        distinct: function(clause) {
            var item, dict = {}, retVal = [];
            for (var i = 0; i < this.items.length; i++) {
                item = clause(this.items[i]);
                if (!dict[item]) {
                    dict[item] = true;
                    retVal[retVal.length] = this.items[i];
                }
            }
            dict = null;
            return $$.joquery.newInstance(retVal);
        },
        any: function(clause) {
        	var result = {'matched':false, 'index':-1, 'item': {}};
            for (var index = 0; index < this.items.length; index++) {
                if (clause(this.items[index], index)) {return {'matched':true, 'index':index, 'item': this.items[index]};}
            }
            return result;
        },
        all: function(clause) {
            for (var index = 0; index < this.items.length; index++) {
                if (!clause(this.items[index], index)) { return false; }
            }
            return true;
        },
        reverse: function() {
            var retVal = new Array();
            for (var index = this.items.length - 1; index > -1; index--)
                retVal[retVal.length] = this.items[index];
            return $$.joquery.newInstance(retVal);
        },
        first: function(clause) {
            if (clause != null) {
                return this.where(clause, true).first();
            } else {
                // If no clause was specified, then return the first element in the Array
                if (this.items.length > 0)
                    return this.items[0];
                else
                    return null;
            }
        },
        last: function(clause) {
            if (clause != null) {
                return this.reverse().first(clause);
            } else {
                // If no clause was specified, then return the first element in the Array
                if (this.items.length > 0)
                    return this.items[this.items.length - 1];
                else
                    return null;
            }
        },
        elementAt: function(index) {
            return this.items[index];
        },
        concatArray: function(array) {
            var arr = array.items || array;
            return $$.joquery.newInstance(this.items.concat(arr));
        },
        intersect: function(secondArray, clause) {
            var clauseMethod;
            if (clause != undefined) {
                clauseMethod = clause;
            } else {
                clauseMethod = function(item, index, item2, index2) { return item == item2; };
            }

            var sa = secondArray.items || secondArray;

            var result = new Array();
            for (var a = 0; a < this.items.length; a++) {
                for (var b = 0; b < sa.length; b++) {
                    if (clauseMethod(this.items[a], a, sa[b], b)) {
                        result[result.length] = this.items[a];
                    }
                }
            }
            return $$.joquery.newInstance(result);
        },
        defaultIfEmpty: function(defaultValue) {
            if (this.items.length == 0) {
                return defaultValue;
            }
            return this;
        },
        elementAtOrDefault: function(index, defaultValue) {
            if (index >= 0 && index < this.items.length) {
                return this.items[index];
            }
            return defaultValue;
        },
        firstOrDefault: function(defaultValue) {
            return this.first() || defaultValue;
        },
        lastOrDefault: function(defaultValue) {
            return this.last() || defaultValue;
        },
        /**
         * 将新元素插入到指定条件的位置,并返回插入的index等信息
         * 果找不到满足clause条件的记录，则把item追加到目标数组的最后
         * @param item 新的数组元素
         * @param clause 条件
         * @returns {*} 结果
         */
        insert: function(item, clause) {
         	var result = {'matched':false, 'index':-1, 'item': {}};
         	if (this.items.length < 1) {
         		this.items.splice(0, 0, item);
         		return {'matched':true, 'index':0, 'item': item}; 
         	}
            for (var index = 0; index < this.items.length; index++) {
                if (clause(this.items[index], index)) {
                	this.items.splice(index, 0, item);
                	return {'matched':true, 'index':index, 'item': item}; 
                }
            }
            if (!result.matched) {
            	this.items[this.items.length] = item;
            	return {'matched':true, 'index':this.items.length - 1, 'item': item};  
            }
            return result;       	
        },
        /**
         * 将新元素插入/修改到指定条件的位置,并返回插入/修改的元素的index等信息,如修改条件满足则只进行修改操作
         * 如果找不到满足updateClause， insertClause条件的记录，则把item追加到目标数组的最后
         * @param item  新的数组元素
         * @param updateClause 修改条件
         * @param insertClause 新增条件
         * @returns {*} 结果
         */
        updateOrInsert: function(item, updateClause, insertClause) {
         	var result = {'matched':false, 'index':-1, 'item': {}};
         	if (this.items.length < 1) {
         		this.items.splice(0, 0, item);
         		return {'matched':true, 'index':0, 'item': item}; 
         	}
            for (var index = 0; index < this.items.length; index++) {
                if (updateClause != undefined && updateClause(this.items[index], index)) {
                	this.items[index] = item;
                	return {'matched':true, 'index':index, 'item': item}; 
                } else if (insertClause(this.items[index], index)) {
                	this.items.splice(index, 0, item);
                	return {'matched':true, 'index':index, 'item': item}; 
                }
            }
            if (!result.matched) {
            	this.items[this.items.length] = item;
            	return {'matched':true, 'index':this.items.length - 1, 'item': item};  
            }
            return result;       	
        }
	});
	$$.joquery.defaults = {
		scope: 'prototype',
		end: 0
	};
});
/**
 * A minimal implementation of Promises/A+
 */
skyjs.plugin('async', function($$) {
    (function (createModule) {
        "use strict";
        if ($$.utils.isNodeJSSupport()) {
            createModule(exports);
        } else if ($$.utils.isAmdSupport()) {
            define('async', function () {
                return createModule();
            });
        } else if ($$.utils.isBrowserSupport()) {
            $$.async = createModule();
        }
    }(function (async) {
        "use strict";
        var AsyncDeferred = function () {},
            AsyncPromise = function () {},
            resolveDeferred = function (deferred, x) {
                var xThen = null;
                if (deferred.promise === x) {
                    return deferred.reject(new TypeError("Cannot resolve a promise with itself"));
                }
                if (x instanceof AsyncPromise) {
                    if (x.state === "fulfilled") { return deferred.fulfill(x.result); }
                    if (x.state === "rejected") { return deferred.reject(x.result); }
                    return x.then(deferred.fulfill, deferred.reject);
                }
                try {
                    if (!($$.utils.isObject(x) || $$.utils.isFunction(x)) || !$$.utils.isFunction(xThen = x.then)) {
                        return deferred.fulfill(x);
                    }
                } catch (error) {
                    deferred.reject(error);
                }
                xThen(function (value) {
                    resolveDeferred(deferred, value);
                }, function (reason) {
                    deferred.reject(reason);
                });
            },
            createEvaluator = function (onResulted, deferred) {
                return function (result) {
                    try {resolveDeferred(deferred, onResulted(result));} catch (reason) {deferred.reject(reason);}
                };
            },
            createDeferred = function () {
                var
                    state = "pending",
                    result,
                    fulfillQueue = [],
                    rejectQueue = [],
                    promise = new AsyncPromise(),
                    deferred = null,
                    queueForFulfillment = function (onFulfilled, dependantDeferred) {
                        if (state === "rejected") {return;}
                        $$.utils.isFunction(onFulfilled) || (onFulfilled = function (value) { return value; });
                        var evaluator = createEvaluator(onFulfilled, dependantDeferred);
                        state === "fulfilled" ? $$.utils.nextTick(evaluator, result) : fulfillQueue.push(evaluator);
                    },
                    queueForRejection = function (onRejected, dependantDeferred) {
                        if (state === "fulfilled") {return;}
                        $$.utils.isFunction(onRejected) || (onRejected = function (error) {throw error;});
                        var evaluator = createEvaluator(onRejected, dependantDeferred);
                        state === "rejected" ? $$.utils.nextTick(evaluator, result) :
                            rejectQueue.push(evaluator);
                    },
                    fulfill = function (value) {
                        if (state !== "pending") {return;}
                        state = "fulfilled";
                        for (var i = 0, l = fulfillQueue.length; i < l; ++i) { fulfillQueue[i](value); }
                        fulfillQueue = [];
                        result = value;
                        return promise;
                    },
                    reject = function (reason) {
                        if (state !== "pending") {return;}
                        state = "rejected";
                        for (var i = 0, l = rejectQueue.length; i < l; ++i) { rejectQueue[i](reason); }
                        rejectQueue = [];
                        result = reason;
                        return promise;
                    };
                promise.then = function (onFulfilled, onRejected) {
                    var dependantDeferred = createDeferred();
                    queueForFulfillment(onFulfilled, dependantDeferred);
                    queueForRejection(onRejected, dependantDeferred);
                    return dependantDeferred.promise;
                };
                promise.state = state;
                promise.result = result;
                AsyncDeferred.prototype = promise;
                deferred = new AsyncDeferred();
                deferred.promise = promise;
                deferred.fulfill = fulfill;
                deferred.reject = reject;
                deferred.resolve = function (result) { resolveDeferred(this, result);};
                return deferred;
            };
        async = async || {};
        async.defer = createDeferred;
        async.version = "1.0.0";
        return async;
    }));
});
/**
 * javascript AMD规范实现, 应注意避免模块间的循环依赖:被依赖的模块应放在依赖数组的靠前元素位置
 * Created by Administrator on 2014/8/11.
 */
skyjs.plugin('amd', function($$) {
    var commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg, cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g;
    var parsedRequireStack = {}; //e.g. {'foo':true, 'foo_1':true, 'foo_1_1':true} //用于消除死循环依赖
    var defines = {}; //e.g. {'foo':{'id':'foo',deps:[],callback:function(){}}};
    var exports = {
        'require': {'id':'require', 'getInstance': function() {
            return function (module) {
                if (typeof module === 'string') {
                    if (exports[module]) {
                        return exports[module]['getInstance'];
                    }
                    throw new Error(module + ' has not been defined. Please include it as a dependency in define()');
                    return;
                }
            };
        }()},
        'exports': {'id':'exports', 'getInstance': function() {
            return exports;
        }()},
        'module': {'id':'module', 'getInstance': function() {
            return function(context) {
                return {
                    id: context,
                    uri: loader.toUrl(context)
                }
            };
        }}
    }; //e.g. {'foo':{'id':'foo','getInstance':function(){return callback.apply(null, args)}}}
    var loader = {};
    define = function(id, dependencies, factory) {
        var argLen = arguments.length;
        if (argLen === 1) {
            factory = id;
            dependencies = undefined;
            id = undefined;
        } else if (argLen === 2) {
            if ({}.toString.call(id) === '[object Array]') {
                factory = dependencies;
                dependencies = id;
                id = undefined;
            } else {
                factory = dependencies;
                dependencies = undefined;
            }
        }
        //在define方法里有require('xxx')的情况
        if (!dependencies && (typeof factory === 'function')) {
            dependencies = [];
            if (factory.length) {
                factory
                    .toString()
                    .replace(commentRegExp, '')
                    .replace(cjsRequireRegExp, function (match, dep) {
                        dependencies.push(dep);
                    });
                dependencies = (factory.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat(dependencies);
            }
        }
        if (id && !defines[id]) {
            defines[id] = {'id':id, 'deps':dependencies || [], callback: factory};
        }
    };
    require = function(modules, callback, context) {
        var invokeStack = [], deferred = $$.async.defer();
        if (typeof modules === 'string') {
            return;
        }
        //将没有依赖或只有'require', 'exports', 'module'的依赖放在依赖列表的后面
        loader.loadParsedRequireStack(modules, [], 0, deferred);
        deferred.promise.then(function(result) {
            loader.getDepsStack(modules, invokeStack);
            invokeStack = $$.joquery.newInstance(invokeStack).orderByDesc(function(module) {
                var deps = defines[module]['deps'] || [], depsCount = 0;
                $$.utils.forEach(deps, function(dep, index) {
                    if (dep === 'require' || dep === 'exports' || dep === 'module') {
                        return;
                    }
                    depsCount++;
                });
                return depsCount;
            }).toArray();
            for (var i = invokeStack.length - 1; i >= 0; i--) {
                var thisExport = invokeStack[i];
                if (!exports[thisExport]) {
                    exports[thisExport] = {'id':thisExport, 'getInstance': (function() {
                        try {
                            var args = [], depsInstances = defines[thisExport]['deps'];
                            for (var j = 0; j < depsInstances.length; j++) {
                                if ((exports[depsInstances[j]] || {})['getInstance']) {
                                    args[args.length] = (exports[depsInstances[j]] || {})['getInstance'];
                                }
                            }
                            return defines[thisExport]['callback'].apply(null, args);
                        } catch (error) {
                            deferred.reject(error.message);
                        }
                    })()}
                }
            }
            var loadedModules = [];
            for (var x = 0; x < modules.length; x++) {
                switch (modules[x]) {
                    case 'require':
                        loadedModules[x] = exports['require']['getInstance'];
                        break;
                    case 'exports':
                        loadedModules[x] = exports['exports']['getInstance']('context');
                        break;
                    case 'module':
                        loadedModules[x] = exports['module'].getInstance()('context');
                        break;
                    case exports[context] ? exports[context]['id'] : '':
                        loadedModules[x] = exports[context].getInstance();
                        break;
                    default:
                        loadedModules[x] = exports[modules[x]]['getInstance'];
                };
            }
            callback && callback.apply(null, loadedModules);
        }, function(error) {
            //FIXME need error handle in promise
            throw new Error('Error Occurred in require promise1:' + error.message);
        }).then(function(result) {
            //noop
        }, function(error) {
            //FIXME need error handle in promise
            $$.utils.isH5Support() && console.log('Error Occurred in require promise2:' + error.message);
            throw new Error('Error Occurred in require promise2:' + error.message);
        });
    };
    define.config = {
        'baseUrl': 'http://localhost:63342/skyjs/lib/amd/',
        'alias': {
            'xxx': 'plugins/xxx.min'
        },
        'usingInclude': {
            'default': true,
            'module': {
                'foo': false
            }
        },
        'shim': {
            'backbone': {
                'deps': [
                    'underscore',
                    'jquery'
                ],
                'exports': 'Backbone'
            }
        }
    };
    define.amd = {'async':true};
    loader.getDepsStack = function(modules, invokeStack, invokedModules) {
        invokedModules = invokedModules || {};
        if (typeof modules === 'string') {
            modules = [modules];
        }
        for (var i = 0; i < modules.length; i++) {
            var thisModule = modules[i];
            if (thisModule === 'require' || thisModule === 'exports' || thisModule === 'module') {
                continue;
            }
            if (defines[thisModule]) {
                if (invokedModules[thisModule]) {
                    continue;
                }
                invokedModules[thisModule] = true;  //消除死循环依赖
                invokeStack[invokeStack.length] = thisModule;
                var deps = defines[thisModule]['deps'] || [];
                for (var j = deps.length - 1; j >= 0; j--) {
                    //同级的依赖顺序应是：被依赖的赖块ID放在数组前面的元素位置
                    loader.getDepsStack(deps[j] , invokeStack, invokedModules);
                }
            }
        }
    };
    loader.loadParsedRequireStack = function(modules, needLoadModules, countdown, deferred) {
        var needLoadResources = [];
        needLoadModules = needLoadModules || [];
        loader.parseRequireStack(modules, needLoadModules);
        for (var i = 0; i < needLoadModules.length; i++) {
            needLoadResources[needLoadResources.length] = loader.toUrl(needLoadModules[i]) + '.js';
        }
        if (countdown < 1 && needLoadResources.length < 1) {
            deferred.resolve(modules);
        }
        if (needLoadResources.length > 0) {
            countdown += needLoadResources.length;
            $$.includeRes.loadHeadRes(needLoadResources, function() {
                countdown -= needLoadResources.length;
                var depsNeedLoadResources = [];
                for (var i = 0; i < needLoadModules.length; i++) {
                    depsNeedLoadResources = depsNeedLoadResources.concat(defines[needLoadModules[i]]['deps']);
                }
                loader.loadParsedRequireStack(depsNeedLoadResources, [], countdown, deferred);
            });
        }
    };
    loader.parseRequireStack = function(modules, needLoadModules) {
        if (typeof modules === 'string') {
            modules = [modules];
        }
        needLoadModules = needLoadModules || [];
        for (var x = 0; x < modules.length; x++) {
            var thisModule = modules[x];
            if (parsedRequireStack[thisModule]) {
                continue;
            }
            parsedRequireStack[thisModule] = true;
            switch (thisModule) {
                case 'require':
                    break;
                case 'exports':
                    break;
                case 'module':
                    break;
                default:
                    if (defines[thisModule]) {
                        if (defines[thisModule]['deps'] && defines[thisModule]['deps'].length > 0) {
                            loader.parseRequireStack(defines[thisModule]['deps'], needLoadModules);
                        }
                    } else {
                        needLoadModules.splice(0,0,thisModule);
                    }
            }
        }
    };
    loader.toUrl = function(id, context) {
        var newContext, i, changed;
        if (define.config.alias[id]) {
            id = define.config.alias[id];
        }
        switch (id) {
            case 'require':
            case 'exports':
            case 'module':
                return id;
        }
        newContext = (context || define.config.baseUrl).split('/');
        newContext.pop();
        id = id.split('/');
        i = id.length;
        while (--i) {
            switch (id[0]) {
                case '..':
                    newContext.pop();
                case '.':
                case '':
                    id.shift();
                    changed = true;
            }
        }
        return newContext.join('/') + '/' + id.join('/');
    };
});
///#source 1 1 /src/1.0.0/load.js
/* head.load - v1.0.3 */
/*
 * HeadJS     The only script in your <HEAD>
 * Author     Tero Piirainen  (tipiirai)
 * Maintainer Robert Hoffmann (itechnology)
 * License    MIT / http://bit.ly/mit-license
 * WebSite    http://headjs.com
 */
//for skyjs: 去掉注释中的!符号,并将以下的(符号改为!执行符号
!function (win, undefined) {
    "use strict";

    //#region variables
    var doc        = win.document,
        domWaiters = [],
        handlers   = {}, // user functions waiting for events
        assets     = {}, // loadable items in various states
        isAsync    = "async" in doc.createElement("script") || "MozAppearance" in doc.documentElement.style || win.opera,
        isDomReady,

        /*** public API ***/
        headVar = win.head_conf && win.head_conf.head || "head",
        api     = win[headVar] = (win[headVar] || function () { api.ready.apply(null, arguments); }),

        // states
        PRELOADING = 1,
        PRELOADED  = 2,
        LOADING    = 3,
        LOADED     = 4;
    //#endregion

    //#region PRIVATE functions

    //#region Helper functions
    function noop() {
        // does nothing
    }

    function each(arr, callback) {
        if (!arr) {
            return;
        }

        // arguments special type
        if (typeof arr === "object") {
            arr = [].slice.call(arr);
        }

        // do the job
        for (var i = 0, l = arr.length; i < l; i++) {
            callback.call(arr, arr[i], i);
        }
    }

    /* A must read: http://bonsaiden.github.com/JavaScript-Garden
     ************************************************************/
    function is(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    }

    function isFunction(item) {
        return is("Function", item);
    }

    function isArray(item) {
        return is("Array", item);
    }

    function toLabel(url) {
        ///<summary>Converts a url to a file label</summary>
        var items = url.split("/"),
             name = items[items.length - 1],
             i    = name.indexOf("?");

        return i !== -1 ? name.substring(0, i) : name;
    }

    // INFO: this look like a "im triggering callbacks all over the place, but only wanna run it one time function" ..should try to make everything work without it if possible
    // INFO: Even better. Look into promises/defered's like jQuery is doing
    function one(callback) {
        ///<summary>Execute a callback only once</summary>
        callback = callback || noop;

        if (callback._done) {
            return;
        }

        callback();
        callback._done = 1;
    }
    //#endregion

    function conditional(test, success, failure, callback) {
        ///<summary>
        /// INFO: use cases:
        ///    head.test(condition, null       , "file.NOk" , callback);
        ///    head.test(condition, "fileOk.js", null       , callback);
        ///    head.test(condition, "fileOk.js", "file.NOk" , callback);
        ///    head.test(condition, "fileOk.js", ["file.NOk", "file.NOk"], callback);
        ///    head.test({
        ///               test    : condition,
        ///               success : [{ label1: "file1Ok.js"  }, { label2: "file2Ok.js" }],
        ///               failure : [{ label1: "file1NOk.js" }, { label2: "file2NOk.js" }],
        ///               callback: callback
        ///    );
        ///    head.test({
        ///               test    : condition,
        ///               success : ["file1Ok.js" , "file2Ok.js"],
        ///               failure : ["file1NOk.js", "file2NOk.js"],
        ///               callback: callback
        ///    );
        ///</summary>
        var obj = (typeof test === "object") ? test : {
            test: test,
            success: !!success ? isArray(success) ? success : [success] : false,
            failure: !!failure ? isArray(failure) ? failure : [failure] : false,
            callback: callback || noop
        };

        // Test Passed ?
        var passed = !!obj.test;

        // Do we have a success case
        if (passed && !!obj.success) {
            obj.success.push(obj.callback);
            api.load.apply(null, obj.success);
        }
        // Do we have a fail case
        else if (!passed && !!obj.failure) {
            obj.failure.push(obj.callback);
            api.load.apply(null, obj.failure);
        }
        else {
            callback();
        }

        return api;
    }

    function getAsset(item) {
        ///<summary>
        /// Assets are in the form of
        /// {
        ///     name : label,
        ///     url  : url,
        ///     state: state
        /// }
        ///</summary>
        var asset = {};

        if (typeof item === "object") {
            for (var label in item) {
                if (!!item[label]) {
                    asset = {
                        name: label,
                        url : item[label]
                    };
                }
            }
        }
        else {
            asset = {
                name: toLabel(item),
                url : item
            };
        }

        // is the item already existant
        var existing = assets[asset.name];
        if (existing && existing.url === asset.url) {
            return existing;
        }

        assets[asset.name] = asset;
        return asset;
    }

    function allLoaded(items) {
        items = items || assets;

        for (var name in items) {
            if (items.hasOwnProperty(name) && items[name].state !== LOADED) {
                return false;
            }
        }

        return true;
    }

    function onPreload(asset) {
        asset.state = PRELOADED;

        each(asset.onpreload, function (afterPreload) {
            afterPreload.call();
        });
    }

    function preLoad(asset, callback) {
        if (asset.state === undefined) {

            asset.state     = PRELOADING;
            asset.onpreload = [];

            loadAsset({ url: asset.url, type: "cache" }, function () {
                onPreload(asset);
            });
        }
    }

    function apiLoadHack() {
        /// <summary>preload with text/cache hack
        ///
        /// head.load("http://domain.com/file.js","http://domain.com/file.js", callBack)
        /// head.load(["http://domain.com/file.js","http://domain.com/file.js"], callBack)
        /// head.load({ label1: "http://domain.com/file.js" }, { label2: "http://domain.com/file.js" }, callBack)
        /// head.load([{ label1: "http://domain.com/file.js" }, { label2: "http://domain.com/file.js" }], callBack)
        /// </summary>
        var args     = arguments,
            callback = args[args.length - 1],
            rest     = [].slice.call(args, 1),
            next     = rest[0];

        if (!isFunction(callback)) {
            callback = null;
        }

        // if array, repush as args
        if (isArray(args[0])) {
            args[0].push(callback);
            api.load.apply(null, args[0]);

            return api;
        }

        // multiple arguments
        if (!!next) {
            /* Preload with text/cache hack (not good!)
             * http://blog.getify.com/on-script-loaders/
             * http://www.nczonline.net/blog/2010/12/21/thoughts-on-script-loaders/
             * If caching is not configured correctly on the server, then items could load twice !
             *************************************************************************************/
            each(rest, function (item) {
                // item is not a callback or empty string
                if (!isFunction(item) && !!item) {
                    preLoad(getAsset(item));
                }
            });

            // execute
            load(getAsset(args[0]), isFunction(next) ? next : function () {
                api.load.apply(null, rest);
            });
        }
        else {
            // single item
            load(getAsset(args[0]));
        }

        return api;
    }

    function apiLoadAsync() {
        ///<summary>
        /// simply load and let browser take care of ordering
        ///
        /// head.load("http://domain.com/file.js","http://domain.com/file.js", callBack)
        /// head.load(["http://domain.com/file.js","http://domain.com/file.js"], callBack)
        /// head.load({ label1: "http://domain.com/file.js" }, { label2: "http://domain.com/file.js" }, callBack)
        /// head.load([{ label1: "http://domain.com/file.js" }, { label2: "http://domain.com/file.js" }], callBack)
        ///</summary>
        var args     = arguments,
            callback = args[args.length - 1],
            items    = {};

        if (!isFunction(callback)) {
            callback = null;
        }

        // if array, repush as args
        if (isArray(args[0])) {
            args[0].push(callback);
            api.load.apply(null, args[0]);

            return api;
        }

        // JRH 262#issuecomment-26288601
        // First populate the items array.
        // When allLoaded is called, all items will be populated.
        // Issue when lazy loaded, the callback can execute early.
        each(args, function (item, i) {
            if (item !== callback) {
                item             = getAsset(item);
                items[item.name] = item;
            }
        });

        each(args, function (item, i) {
            if (item !== callback) {
                item = getAsset(item);

                load(item, function () {
                    if (allLoaded(items)) {
                        one(callback);
                    }
                });
            }
        });

        return api;
    }

    function load(asset, callback) {
        ///<summary>Used with normal loading logic</summary>
        callback = callback || noop;

        if (asset.state === LOADED) {
            callback();
            return;
        }

        // INFO: why would we trigger a ready event when its not really loaded yet ?
        if (asset.state === LOADING) {
            api.ready(asset.name, callback);
            return;
        }

        if (asset.state === PRELOADING) {
            asset.onpreload.push(function () {
                load(asset, callback);
            });
            return;
        }

        asset.state = LOADING;

        loadAsset(asset, function () {
            asset.state = LOADED;

            callback();

            // handlers for this asset
            each(handlers[asset.name], function (fn) {
                one(fn);
            });

            // dom is ready & no assets are queued for loading
            // INFO: shouldn't we be doing the same test above ?
            if (isDomReady && allLoaded()) {
                each(handlers.ALL, function (fn) {
                    one(fn);
                });
            }
        });
    }

    function getExtension(url) {
        url = url || "";

        var items = url.split("?")[0].split(".");
        return items[items.length-1].toLowerCase();
    }

    /* Parts inspired from: https://github.com/cujojs/curl
    ******************************************************/
    function loadAsset(asset, callback) {
        callback = callback || noop;

        function error(event) {
            event = event || win.event;

            // release event listeners
            ele.onload = ele.onreadystatechange = ele.onerror = null;

            // do callback
            callback();

            // need some more detailed error handling here
        }

        function process(event) {
            event = event || win.event;

            // IE 7/8 (2 events on 1st load)
            // 1) event.type = readystatechange, s.readyState = loading
            // 2) event.type = readystatechange, s.readyState = loaded

            // IE 7/8 (1 event on reload)
            // 1) event.type = readystatechange, s.readyState = complete

            // event.type === 'readystatechange' && /loaded|complete/.test(s.readyState)

            // IE 9 (3 events on 1st load)
            // 1) event.type = readystatechange, s.readyState = loading
            // 2) event.type = readystatechange, s.readyState = loaded
            // 3) event.type = load            , s.readyState = loaded

            // IE 9 (2 events on reload)
            // 1) event.type = readystatechange, s.readyState = complete
            // 2) event.type = load            , s.readyState = complete

            // event.type === 'load'             && /loaded|complete/.test(s.readyState)
            // event.type === 'readystatechange' && /loaded|complete/.test(s.readyState)

            // IE 10 (3 events on 1st load)
            // 1) event.type = readystatechange, s.readyState = loading
            // 2) event.type = load            , s.readyState = complete
            // 3) event.type = readystatechange, s.readyState = loaded

            // IE 10 (3 events on reload)
            // 1) event.type = readystatechange, s.readyState = loaded
            // 2) event.type = load            , s.readyState = complete
            // 3) event.type = readystatechange, s.readyState = complete

            // event.type === 'load'             && /loaded|complete/.test(s.readyState)
            // event.type === 'readystatechange' && /complete/.test(s.readyState)

            // Other Browsers (1 event on 1st load)
            // 1) event.type = load, s.readyState = undefined

            // Other Browsers (1 event on reload)
            // 1) event.type = load, s.readyState = undefined

            // event.type == 'load' && s.readyState = undefined

            // !doc.documentMode is for IE6/7, IE8+ have documentMode
            if (event.type === "load" || (/loaded|complete/.test(ele.readyState) && (!doc.documentMode || doc.documentMode < 9))) {
                // remove timeouts
                win.clearTimeout(asset.errorTimeout);
                win.clearTimeout(asset.cssTimeout);

                // release event listeners
                ele.onload = ele.onreadystatechange = ele.onerror = null;

                // do callback   
                callback();
            }
        }

        function isCssLoaded() {
            // should we test again ? 20 retries = 5secs ..after that, the callback will be triggered by the error handler at 7secs
            if (asset.state !== LOADED && asset.cssRetries <= 20) {

                // loop through stylesheets
                for (var i = 0, l = doc.styleSheets.length; i < l; i++) {
                    // do we have a match ?
                    // we need to tests agains ele.href and not asset.url, because a local file will be assigned the full http path on a link element
                    if (doc.styleSheets[i].href === ele.href) {
                        process({ "type": "load" });
                        return;
                    }
                }

                // increment & try again
                asset.cssRetries++;
                asset.cssTimeout = win.setTimeout(isCssLoaded, 250);
            }
        }

        var ele;
        var ext = getExtension(asset.url);

        if (ext === "css") {
            ele      = doc.createElement("link");
            ele.type = "text/" + (asset.type || "css");
            ele.rel  = "stylesheet";
            ele.href = asset.url;

            /* onload supported for CSS on unsupported browsers
             * Safari windows 5.1.7, FF < 10
             */

            // Set counter to zero
            asset.cssRetries = 0;
            asset.cssTimeout = win.setTimeout(isCssLoaded, 500);         
        }
        else {
            ele      = doc.createElement("script");
            ele.type = "text/" + (asset.type || "javascript");
            ele.src = asset.url;
        }

        ele.onload  = ele.onreadystatechange = process;
        ele.onerror = error;

        /* Good read, but doesn't give much hope !
         * http://blog.getify.com/on-script-loaders/
         * http://www.nczonline.net/blog/2010/12/21/thoughts-on-script-loaders/
         * https://hacks.mozilla.org/2009/06/defer/
         */

        // ASYNC: load in parallel and execute as soon as possible
        ele.async = false;
        // DEFER: load in parallel but maintain execution order
        ele.defer = false;

        // timout for asset loading
        asset.errorTimeout = win.setTimeout(function () {
            error({ type: "timeout" });
        }, 7e3);

        // use insertBefore to keep IE from throwing Operation Aborted (thx Bryan Forbes!)
        var head = doc.head || doc.getElementsByTagName("head")[0];

        // but insert at end of head, because otherwise if it is a stylesheet, it will not override values      
        head.insertBefore(ele, head.lastChild);
    }

    /* Parts inspired from: https://github.com/jrburke/requirejs
    ************************************************************/
    function init() {
        var items = doc.getElementsByTagName("script");

        // look for a script with a data-head-init attribute
        for (var i = 0, l = items.length; i < l; i++) {
            var dataMain = items[i].getAttribute("data-headjs-load");
            if (!!dataMain) {
                api.load(dataMain);
                return;
            }
        }
    }

    function ready(key, callback) {
        ///<summary>
        /// INFO: use cases:
        ///    head.ready(callBack);
        ///    head.ready(document , callBack);
        ///    head.ready("file.js", callBack);
        ///    head.ready("label"  , callBack);
        ///    head.ready(["label1", "label2"], callback);
        ///</summary>

        // DOM ready check: head.ready(document, function() { });
        if (key === doc) {
            if (isDomReady) {
                one(callback);
            }
            else {
                domWaiters.push(callback);
            }

            return api;
        }

        // shift arguments
        if (isFunction(key)) {
            callback = key;
            key      = "ALL"; // holds all callbacks that where added without labels: ready(callBack)
        }

        // queue all items from key and return. The callback will be executed if all items from key are already loaded.
        if (isArray(key)) {
            var items = {};

            each(key, function (item) {
                items[item] = assets[item];

                api.ready(item, function() {
                    if (allLoaded(items)) {
                        one(callback);
                    }
                });
            });

            return api;
        }

        // make sure arguments are sane
        if (typeof key !== "string" || !isFunction(callback)) {
            return api;
        }

        // this can also be called when we trigger events based on filenames & labels
        var asset = assets[key];

        // item already loaded --> execute and return
        if (asset && asset.state === LOADED || key === "ALL" && allLoaded() && isDomReady) {
            one(callback);
            return api;
        }

        var arr = handlers[key];
        if (!arr) {
            arr = handlers[key] = [callback];
        }
        else {
            arr.push(callback);
        }

        return api;
    }

    /* Mix of stuff from jQuery & IEContentLoaded
     * http://dev.w3.org/html5/spec/the-end.html#the-end
     ***************************************************/
    function domReady() {
        // Make sure body exists, at least, in case IE gets a little overzealous (jQuery ticket #5443).
        if (!doc.body) {
            // let's not get nasty by setting a timeout too small.. (loop mania guaranteed if assets are queued)
            win.clearTimeout(api.readyTimeout);
            api.readyTimeout = win.setTimeout(domReady, 50);
            return;
        }

        if (!isDomReady) {
            isDomReady = true;

            init();
            each(domWaiters, function (fn) {
                one(fn);
            });
        }
    }

    function domContentLoaded() {
        // W3C
        if (doc.addEventListener) {
            doc.removeEventListener("DOMContentLoaded", domContentLoaded, false);
            domReady();
        }

        // IE
        else if (doc.readyState === "complete") {
            // we're here because readyState === "complete" in oldIE
            // which is good enough for us to call the dom ready!
            doc.detachEvent("onreadystatechange", domContentLoaded);
            domReady();
        }
    }

    // Catch cases where ready() is called after the browser event has already occurred.
    // we once tried to use readyState "interactive" here, but it caused issues like the one
    // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
    if (doc.readyState === "complete") {
        domReady();
    }

    // W3C
    else if (doc.addEventListener) {
        doc.addEventListener("DOMContentLoaded", domContentLoaded, false);

        // A fallback to window.onload, that will always work
        win.addEventListener("load", domReady, false);
    }

    // IE
    else {
        // Ensure firing before onload, maybe late but safe also for iframes
        doc.attachEvent("onreadystatechange", domContentLoaded);

        // A fallback to window.onload, that will always work
        win.attachEvent("onload", domReady);

        // If IE and not a frame
        // continually check to see if the document is ready
        var top = false;

        try {
            top = !win.frameElement && doc.documentElement;
        } catch (e) { }

        if (top && top.doScroll) {
            (function doScrollCheck() {
                if (!isDomReady) {
                    try {
                        // Use the trick by Diego Perini
                        // http://javascript.nwbox.com/IEContentLoaded/
                        top.doScroll("left");
                    } catch (error) {
                        // let's not get nasty by setting a timeout too small.. (loop mania guaranteed if assets are queued)
                        win.clearTimeout(api.readyTimeout);
                        api.readyTimeout = win.setTimeout(doScrollCheck, 50);
                        return;
                    }

                    // and execute any waiting functions
                    domReady();
                }
            }());
        }
    }
    //#endregion

    //#region Public Exports
    // INFO: determine which method to use for loading
    api.load  = api.js = isAsync ? apiLoadAsync : apiLoadHack;
    api.test  = conditional;
    api.ready = ready;
    //#endregion

    //#region INIT
    // perform this when DOM is ready
    api.ready(doc, function () {
        if (allLoaded()) {
            each(handlers.ALL, function (callback) {
                one(callback);
            });
        }

        if (api.feature) {
            api.feature("domloaded", true);
        }
    });
    //#endregion

    /*for skyjs begin*/
    skyjs.utils.namespace('loadRes');
    skyjs.loadRes = api;
    /*for skyjs end*/
}(window);

/**
 * 解析加载资源文件
 */
skyjs.plugin('includeRes', function($$) {
    $$.utils.namespace('includeRes');
	$$.includeRes = {
		writejs: function(src, encode) {
		    document.write('<script type="text/javascript" src='+src+' charset="'+(encode||"UTF-8")+'"></script>');
		},
		writecss: function(link, asyncCss) {
			asyncCss = asyncCss || true;
			if (asyncCss) {
				var cssNode = document.createElement('link');
				cssNode.type = 'text/css'; cssNode.rel = 'stylesheet'; cssNode.href = link;
				document.getElementsByTagName("head")[0].appendChild(cssNode);
			} else {
				//放在头部的css最好要同步下载且放在head元素中
				document.write('<link type="text/css" rel="stylesheet" href="' + link + '" />');
			}
		},
        /**
         * 利用head.load.js类库加载资源文件
         */
        loadHeadRes: function() {
            var args = arguments, _args = [];
            for (var i = 0; i < args.length; i++) {
                if ($$.utils.isArray(args[i])) {
                    _args  = _args.concat(args[i]);
                    continue;
                }
                _args[_args.length] = args[i];
            }
            $$.loadRes.js.apply(null, _args);
        },
		load: function(options) {
			this._parseLoadedRes(options);
			var v = this.getVersion(), confs = [];
			for(var i = 0; i < this.sources.length;  i++) {
				var option = this.sources[i];
				if (option['f'] !== undefined && option['f'] !== '') {
					confs[confs.length] = option['f'] + "?v=" + v;
				}
			}
			confs = $$.joquery.newInstance(confs).distinct(function(item){return item;}).toArray();
			for(var j = 0; j < confs.length;  j++) {
				this.writejs(confs[j]);
			}
			return this;
		},
		loadedModuleName: {},
		//加载应用需要的所有相关js或css文件
		loadModules: function(options) {
			options = $$.utils.extend({name:'', type:'js', mdCallback:function(){}, handleUrlsCallback:function(){}, afterLoadedCallback:function(){}}, options);
			if (typeof $$.includeRes.sources !== 'undefined') {
				var sources = $$.includeRes.sources;
				sources = $$.joquery.newInstance(sources).select(function(item) {
					return (item['n'] === options['name'] && item['t'] === options['type']);
				}).toArray();
				if (sources.length < 1) return this;
				var combineUrls = [];
				for (var i = 0; i < sources.length; i++) {
					//name应唯一,不重复执行相同name的模块
					if (sources[i]['n'] !== '' && $$.includeRes.loadedModuleName[sources[i]['n']]) {
						continue;
					}
					var source = sources[i];
                    if (source['d'] !== undefined && ($$.currentDomain||'') === '') {
                        $$.currentDomain = source['d'];
                    }
					var modules = source['m'].split(";");
					for (var j = 0; j < modules.length; j++) {
						var module = modules[j];
						options.mdCallback.call(null, source, module, combineUrls);
					}
					$$.includeRes.loadedModuleName[source['n']] = source['n'];
				}
				//去掉重复链接文件名
				combineUrls = $$.joquery.newInstance((options.handleUrlsCallback.call(null, combineUrls)||combineUrls)).distinct(function(item) {return item;}).toArray();
				if (combineUrls.length >= 0) {
					if (options.type === 'js') {
						//应用所需的js文件使用异步加载
                        if (combineUrls.length < 1) {
                            options.afterLoadedCallback && options.afterLoadedCallback();
                        } else {
                            this.loadHeadRes(combineUrls.concat([options.afterLoadedCallback]));
                        }
					} else if (options.type === 'css') {
						//FIXME css文件应使用同步加载且应使用minify或concat之类的在线压缩工具,css文件最好不要使用js类库来管理版本号加载（网速慢的情况下头部样式会乱）
						var combineUrlsLen = combineUrls.length;
						for (var r = 0; r < combineUrlsLen; r++) {
							this.writecss(combineUrls[r], false);
						}
					}
				}
			}
            return this;
		},
		sources: [],
		getVersion: function(interval) {
			interval = interval || 2;
			var load_date = new Date();
			var load_day = load_date.getDate()<=9?('0'+load_date.getDate()):load_date.getDate();
			var load_hour = load_date.getHours()<=9?('0'+load_date.getHours()):load_date.getHours();
			var _min = load_date.getMinutes()%2==0?load_date.getMinutes():(load_date.getMinutes()-load_date.getMinutes()%interval);
			var load_minute = _min<=9?('0'+_min):_min;
			return ''+load_date.getFullYear()+(load_date.getMonth()+1)+load_day+load_hour+load_minute;
		},
		_parseLoadedRes: function(options) {
			//只认带有script元素的src属性或src参数中含有onlyforload.js或core.js或core.min.js或core-def.js字符的地址
			options = $$.utils.extend({loadfile:'core-[0-9]+.[0-9]+.[0-9]+.js|core-[0-9]+.[0-9]+.[0-9]+.min.js|onlyforload.js|core.min.js|core.js', isScript:false, src:'{n:"",t:"js",m:"default;"}'}, options);
            //将sources数组清空并初始化
			this.sources.length = 0;
            this.sources[this.sources.length] = {n:'',t:'js',m:'default;'};
			var scripts = options['isScript'] ? document.getElementsByTagName("script") : options['src'].split('|');
			for (var i = 0; i < scripts.length; i++) {
				var src = options['isScript'] ? scripts[i].src : (scripts[i].indexOf('^')<0?('onlyforload.js^'+scripts[i]):scripts[i]);
				var scriptOptions={};
				var isParsed = options['isScript'] ? (src.isparsed || false) : false;
				if (src && src.match(options['loadfile']) && !isParsed ) {
					if(src.indexOf('^') != -1) {
						var multiSrcOptions = src.split('^')[1].replace(new RegExp("%22","gm"),"\"").replace(new RegExp("%27","gm"),"\'").split('|');
						for (var j = 0; j < multiSrcOptions.length; j++) {
							srcOptions = multiSrcOptions[j];
							try {
								scriptOptions = eval("("+srcOptions+")");
							} catch (err) {
								if (typeof(JSON) === 'object' && JSON.parse) {
			        				scriptOptions = JSON.parse(srcOptions);
								}
							}
							this.sources[this.sources.length] = scriptOptions;
						}
						if (options['isScript']) {
							scripts[i].setAttribute('isparsed', 'true');
						}
					}
				}
			}
			return this.sources;
		}
	};
    //define所有的skyjs模块
    if ($$.utils.isAmdSupport()) {
        define('skyjs', function () {
            return $$;
        });
        define('utils', function () {
            return $$.utils;
        });
        define('joquery', function () {
            return $$.joquery;
        });
        define('async', function () {
            return $$.async;
        });
        define('base', function () {
            return $$.base;
        });
        define('loader', function () {
            return $$.includeRes;
        });
        define('eventProxy', function () {
            return $$.eventProxy.newInstance();
        });
        define('fsm', function () {
            return $$.fsm;
        });
        define('app', function () {
            return $$.app.newInstance();
        });
    }
	$$.includeRes.load({isScript:true});
});
/**
 * 实现模块间通信的代理类, 每个模块都有自己的eventProxy，用来降低模块间耦合度，各模块只能直接和eventProxy打交道。
 * @date 2014-08-30
 */
skyjs.plugin('eventProxy', function($$) {
	$$.base("eventProxy", {
		init: function(){
			this.channels = {};
			return this;
		},
		/**
		* @method: on
		* @param: channel: 要监听事件的名称（string|Array）
		* @param: fn: 监听事件的回调函数（function）
		* @param: context: （可选）这个参数可以指定fn的作用域
		*/
		on: function(channel, fn, context) {
			var id, subscription, self, i, _len, _results;
			if (context == null) context = this;
			if (this.channels[channel] == null) this.channels[channel] = [];
			self = this;
			//允许使用一个回调函数同时监听多个事件，
			if (channel instanceof Array) {
				_results = [];
				for (i = 0, _len = channel.length; i < _len; i++) {
				id = channel[i];
				_results.push(this.subscribe(id, fn, context));
			}
			return _results;
		  }else {
			subscription = {
				context: context,
				callback: fn
			};
			return {
			  attach: function() {
				self.channels[channel].push(subscription);
				return this;
			  },
			  detach: function() {
				Mediator._rm(self, channel, subscription.callback);
				return this;
			  }
			}.attach();
		  }
		},
		/**
		* @method: off，有多种方式可以移除监听事件
		* @param: ch: 要监听事件的名称（string|function）
		* @param: cb: 要移除监听的回调函数（可选）
		*/
		off: function(ch, cb) {
		  var id;
		  switch (typeof ch) {
			case "string":
			  if (typeof cb === "function") Mediator._rm(this, ch, cb);
			  if (typeof cb === "undefined") Mediator._rm(this, ch);
			  break;
			case "function":
			  for (id in this.channels) {
				Mediator._rm(this, id, ch);
			  }
			  break;
			case "undefined":
			  for (id in this.channels) {
				Mediator._rm(this, id);
			  }
			  break;
			case "object":
			  for (id in this.channels) {
				Mediator._rm(this, id, null, ch);
			  }
		  }
		  return this;
		},
		/**
		* @method: emit
		* @param: channel: 要监听事件的名称（string）
		* @param: data: 通过事件传递的数据，可以是数组（object|Array）
		* @param: publishReference: （可选）默认为false，保证data数据不被修改。 如果为true，则data数据作为引用传值给其它模块，可能会被修改。
		*/
		emit: function(channel, data, publishReference) {
		  var copy, k, subscription, v, i, _len, _ref;
		  if (this.channels[channel] != null) {
			_ref = this.channels[channel];
			for (i = 0, _len = _ref.length; i < _len; i++) {
			  subscription = _ref[i];
			  if (publishReference !== true && typeof data === "object") {
				if (data instanceof Array) {
				  copy = (function() {
					var _j, _len2, _results;
					_results = [];
					for (_j = 0, _len2 = data.length; _j < _len2; _j++) {
					  v = data[_j];
					  _results.push(v);
					}
					return _results;
				  })();
				} else {
				  copy = {};
				  for (k in data) {
					v = data[k];
					copy[k] = v;
				  }
				}
				subscription.callback.apply(subscription.context, [copy, channel]);
			  } else {
				subscription.callback.apply(subscription.context, [data, channel]);
			  }
			}
		  }
		  return this;
		},
		end: 0
	});
	$$.eventProxy.defaults = {
		scope: 'singleton',
		end: 0
	};
});
/**
 * 控制各个模块的生命周期，创建及销毁
 * @date 2014-08-30
 */
skyjs.plugin('app', function($$) {
	$$.base("app", {
		init: function(arg) {	
			this.moduleData = {};
			this.eventProxy = $$.eventProxy.newInstance();
			return this;
		},
		/**
		* @method: register 模块注册函数
		* @param: creator: 模块的构造函数（string|function），如果为string，则会被parse成为function
		* @param: opt: （可选）可配置参数，可以传入callback或其它配置参数
		*/
		register: function(creator, opt) {
			try {
                var moduleId = creator.getName();
                opt = opt || {};
                this._addModule(moduleId, creator, opt);
                if(opt.init){
                    return this.start(moduleId);
                }
                return moduleId;
			} catch (ex) {
			    throw new Error("could not register " + moduleId + " because: " + ex.stack||ex.message);
			    return undefined;
			}
		},
        /**
         * register动作与start动作合二为一
         * @param creator
         * @param opt
         */
        registerAndStart: function(creator, opt) {
            return this.start(this.register(creator, opt));
        },
		/**
		* @method: unregister 模块卸载函数
		* @param: moduleId: 注册模块的名称（string）
		*/
		unregister: function(moduleId) {
			if (this.moduleData[moduleId] != null) {
			  delete this.moduleData[moduleId];
			  return true;
			} else {
			  return false;
			}
		},

		/**
		* @method: start 初始化模块
		* @param: moduleId: 注册模块的名称（string）
		*/
		start: function(moduleId){
            if (!moduleId) {
                return false;
            }
			//try-catch保证了在online模式下，一个模块的异常不会影响到其它模块，消除SPOF（单点故障）。
			//在debug模式下，把错误抛给浏览器处理，一个模块失败会影响到其它模块。这样便于发现错误。
			try {
				if (this.moduleData[moduleId] == null){
					throw new Error("module " + moduleId + " does not exist");
				}
				//var start = $$.utils.now();
				var opt = this.moduleData[moduleId].options;
				if (opt == null) opt = {};
				
				var instance = this._createInstance(moduleId, opt);
				if (instance.running === true){
					throw new Error("module " + moduleId + " was already started");
				}
				if (typeof instance.init !== "function") {
					throw new Error("module " + moduleId + " do not have an init function");
				}
				instance.option(instance.options);
				instance.running = true;
				this.moduleData[moduleId].instance = instance;
				if (typeof opt.callback === "function"){
					opt.callback();
				}
				//skyjs.logger.debug(moduleId + " init finished, cost:" + ($$.utils.now() - start) + " ms");
				return true;
			} catch (ex) {
			    throw new Error(moduleId + " init Error: " + ex.stack||ex.message);
			    return false;
			}
		},
		/**
		* @method: startAll 初始化所有已注册模块
		*/		
		startAll: function(){
			var moduleId, results = [];
			for (moduleId in this.moduleData){
				if (this.moduleData.hasOwnProperty(moduleId)){
                    results.push(this.start(moduleId));
				}
			}
			//通知所有的模块以及初始化完毕，有需要监听此事件的模块可以处理callback函数。
			this.eventProxy.emit($$.sysConfig.events.moduleIsReady);
			return results;
		},
		/**
		* @method: stop 停止一个模块的运行
		* @param: moduleId: 注册模块的名称（string）
		*/		
		stop:function(moduleId) {
			var module = this.moduleData[moduleId];
			if (module.instance) {
				if($$.utils.isFunction(module.instance.destroy)){
					module.instance.destroy();
				}
				module.instance.running = false;
				module.instance = null;
				return true;
			} else {
				return false;
			}
		},
  		/**
		* @method: stopAll 停止所有模块的运行
		*/	
		stopAll:function() {
			var moduleId, _results;
			_results = [];
			for (moduleId in this.moduleData){
				if (this.moduleData.hasOwnProperty(moduleId)){
					_results.push(this.stop(moduleId));
				}
			}
			return _results;
		},
  		/**
		* @method: reStart 重新启动一个模块
		* @param: moduleId: 注册模块的名称（string）
		*/		
		restart:function(moduleId){
			if(this.stop(moduleId)){
				return this.start(moduleId);
			}
			return false;
		},
		_addModule: function(moduleId, creator, opt) {
			if (typeof moduleId !== "string") {
				throw new Error("moudule ID has to be a string");
			}
			var original = creator;
			if(typeof creator === "string"){
				creator = this._parseFunction(creator);
			}
 			if (typeof creator !== "function") {
				throw new Error(creator + " creator "+ original +" has to be a constructor function");
			}	
			if (typeof opt !== "object") {
				throw new Error("option parameter has to be an object");
			}
			if (this.moduleData[moduleId] != null) {
				throw new Error("module was already registered");
			}
			this.moduleData[moduleId] = {
				creator: creator,
				options: opt
			};
			return true;
		  },
		_createInstance: function(moduleId, opt) {
            var module = this.moduleData[moduleId];
            if (module.instance != null){
                return module.instance;
            }
            return module.creator.newInstance($$.eventProxy.newInstance(), opt);
		},

		/**
		 * 将字符串转化为函数
		 */
		_parseFunction:function(s){
			var a = s.split('.'),
			l=a.length,
			o = window;
			for (var i=($$.utils.isWindow(a[0])?1:0);i<l;i++) {
				if($$.utils.isFunction(o[a[i]]) || $$.utils.isPlainObject(o[a[i]])) {
					o = o[a[i]];
				} else {
					return null;
				}
			}
			if($$.utils.isFunction(o)){
				return o;
			}
			return null;
		},
		end:0
	});
	$$.app.defaults = {
		scope: 'singleton',
		end: 0
	};
});