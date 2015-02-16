(function(){
	// Array Remove - By John Resig (MIT Licensed)
	Array.prototype.remove = function(from, to) {
		var rest = this.slice((to || from) + 1 || this.length);
		this.length = from < 0 ? this.length + from : from;
		return this.push.apply(this, rest);
	};
})();


function copyTouchCoordinate( touch ){
	return {
		x : touch.pageX*window.devicePixelRatio,
		y : touch.pageY*window.devicePixelRatio
	};
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge]
 * @returns {Object} dest
 */
function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}

/**
 * check if x is an Array
 * @param {Object} x
 * @returns {Boolean} 
 */
function isArray(x){
	return x instanceof Array;
}

/**
 * calculate the square of the distance between point a and b
 * @param {Object} a
 * @param {Object} b
 * @returns {Number}
 */
function getSquareDistance( a, b ){
	var dx = a.x - b.x;
	var dy = a.y - b.y;
	return dx*dx + dy*dy;
}

var EventListener = {
	bind : function( eventName, fn ){
		if( !isArray(this.listener ) ){
			this.listener = [];
		}
		
		if( !isArray(this.listener[eventName]) ) {
			this.listener[eventName] = [];
		}
		
		this.listener[eventName].push( fn );
		return true;
	},
	unbind : function( eventName, fn ){		
		// event callback list doesn't exist
		if( !isArray(this.listener) ) return false;
		if( !isArray(this.listener[eventName]) ) 
			return false;
		
		for( var i = 0; i < this.listener[ eventName ].length; ++ i ){
			if( this.listener[ eventName ][i] == fn ){
				this.listener[ eventName ].remove(i);
				return true;
			}
		}
		
		// function not found in the list
		return false;
	},
	trigger : function( eventName ){
		if( !isArray(this.listener) ) return;
		if( !isArray(this.listener[eventName]) ) return;
		
		var param = [];
		for( var i = 1; i < arguments.length; ++ i ){
			param[i-1] = arguments[i];
		}
		
		for( var i = 0; i < this.listener[eventName].length; ++ i ){
			this.listener[eventName][i].apply( this, param );
		}
	}
};


var Direction = {
	UP : 1,
	DOWN : 1 << 1,
	LEFT : 1 << 2,
	RIGHT : 1 << 3
};
var Recognizer = (function(){	
	function Recognizer( element ){
		if( !element ) 
			throw new Error('element is not given');

		this.element = element;	
		this.init();
	}
	
	
	// since touch identifier is unique for each touch not each element 
	// it will be a static variable
	var touchCache = [];
	
	function touchstart( event ){
		var changedTouches = event.changedTouches;
		for( var i = 0; i < changedTouches.length; ++ i ){
			var touch = event.changedTouches[i];
			var cache = touchCache[touch.identifier] = { id : touch.identifier };
			this.trigger('touchstart', touch, cache );
		}
	}

	function touchmove( event ){
		var changedTouches = event.changedTouches;
		for( var i = 0; i < changedTouches.length; ++ i ){
			var touch 		= changedTouches[i];
			var cache = touchCache[touch.identifier];

			this.trigger('touchmove', touch, cache );
		}
	}
	
	function touchcancel( event ){
		var changedTouches = event.changedTouches;
		for( var i = 0; i < changedTouches.length; ++ i ){
			var touch 		= changedTouches[i];
			var cache = touchCache[touch.identifier];

			this.trigger('touchcancel', touch, cache );
			delete touchCache[touch.identifier];
		}
	}
	
	function touchend( event ){
		var changedTouches = event.changedTouches;
		for( var i = 0; i < changedTouches.length; ++ i ){
			var touch 		= changedTouches[i];
			var cache = touchCache[touch.identifier];

			this.trigger('touchend', touch, cache );
			delete touchCache[touch.identifier];
		}
	}


	extend( Recognizer.prototype, {
		init : function(){
			this.element.addEventListener('touchstart', touchstart.bind(this));
			this.element.addEventListener('touchmove', touchmove.bind(this) );
			this.element.addEventListener('touchcancel', touchcancel.bind(this) );
			this.element.addEventListener('touchend', touchend.bind(this) );
		}
	});
	
	extend( Recognizer.prototype, EventListener );
	
	return Recognizer;
})();

/**
	WARNING : Please do not use more than one Subscriber for each type for one recognizer
	e.g. 
		r = new Recognizer( someDOM );
		c = new ClockHandCounter( r );
		c2 = new ClockHandCounter( r );
	
	The code above will give the wrong result
 */

 var ClockHandCounter = (function(){
	function ClockHandCounter( recognizer ){
		if( !( recognizer instanceof Recognizer ) ) throw new Error('first parameter is not a recognizer');
		
		this.recognizer = recognizer;
		this.init();
	}
	
	extend( ClockHandCounter.prototype, EventListener );
	extend( ClockHandCounter.prototype, {
		init : function(){
			this.recognizer.bind('touchstart', touchstart.bind(this));
			this.recognizer.bind('touchmove', touchmove.bind(this));
		}
	});
	
	function touchstart( touch, cache ){
		cache.ccwcount = 0;
		cache.cwcount = 0;
		cache.lastone = copyTouchCoordinate( touch );
		cache.lasttwo = null;
	}

	function touchmove( touch, cache ){
		var c = copyTouchCoordinate( touch );
		// if both define
		if( cache.lastone && cache.lasttwo ){
			var isCCW = ccw( cache.lasttwo, cache.lastone, c );
			if( isCCW ){
				cache.ccwcount ++;
			}
			else {
				cache.cwcount ++;
			}
			
			this.trigger('touchmove', touch, cache, isCCW );
		}
		
		cache.lasttwo = cache.lastone;
		cache.lastone = c;
	}
	
	function ccw(p1, p2, p3){
		return (p2.x - p1.x)*(p3.y - p1.y) - (p2.y - p1.y)*(p3.x - p1.x) <= 0;
	}
	
	return ClockHandCounter;
})();

var DistanceCounter = (function(){
	function DistanceCounter( recognizer ){
		if( !( recognizer instanceof Recognizer ) ) 
			throw new Error('first parameter is not a recognizer');
		this.recognizer = recognizer;
		
		
		this.init();
	}
	
	extend( DistanceCounter.prototype, EventListener );
	extend( DistanceCounter.prototype, {
		init : function(){
			this.recognizer.bind('touchstart', touchstart.bind(this));
			this.recognizer.bind('touchmove', touchmove.bind(this));
			this.recognizer.bind('touchend', touchend.bind(this));
		}
	});
	
	function touchstart(touch,cache){
		cache.firstTouch = copyTouchCoordinate( touch );
		cache.startTime = new Date();
		this.trigger('touchstart', touch, cache );
	}
	
	function touchmove(touch,cache){
		update(touch,cache);
		this.trigger('touchmove', touch, cache );
	}
	
	function touchend(touch,cache){
		update(touch,cache);
		this.trigger('touchend', touch, cache );
	}
		
	function update(touch,cache){
		cache.lastTouch = copyTouchCoordinate( touch );
		cache.lastTime = new Date();
		cache.elapsedTime = cache.lastTime - cache.startTime;

		var dx = cache.lastTouch.x - cache.firstTouch.x;
		var dy = cache.lastTouch.y - cache.firstTouch.y;
		
		cache.distanceX = dx
		cache.distanceY = dy
		cache.squareDistance = dx*dx + dy*dy;
	}
	
	
	return DistanceCounter;
})();

/**
	SwipeDetector
	
	constructor
		
	
*/
var SwipeDetector = (function(){
	function SwipeDetector(recognizer, minDistance, restraint, maxTime ){
		if( !( recognizer instanceof DistanceCounter ) ) 
			throw new Error('first parameter is not a recognizer');
		this.recognizer = recognizer;
		this.minDistance = minDistance || 150;
		this.restraint = restraint || this.minDistance * 0.66;
		this.maxTime = maxTime || 300;
		
		this.init();
	}
	
	extend( SwipeDetector.prototype, EventListener );
	extend( SwipeDetector.prototype, {
		init : function(){
			this.recognizer.bind('touchstart', touchstart.bind(this));
			this.recognizer.bind('touchend', touchend.bind(this));
		}
	});

	function touchstart( touch, cache){
	}
	
	function touchend( touch, cache){	
		var dx = cache.distanceX;
		var dy = cache.distanceY;
		var elapsedTime = cache.elapsedTime;
		
		if( elapsedTime > this.maxTime ) return;
		
		if( Math.abs(dx) >= this.minDistance && Math.abs(dy) <= this.restraint ){
			this.trigger((dx < 0?'swipeleft':'swiperight'), Math.abs(dx));
		}
		
		if( Math.abs(dy) >= this.minDistance && Math.abs(dx) <= this.restraint ){
			this.trigger((dy < 0?'swipeup':'swipedown'), Math.abs(dy));
		}
	}	
	
	return SwipeDetector;
})();

/**
	TwoSwipeDetector
*/
var TwoSwipeDetector = (function(){
	function TwoSwipeDetector( recognizer, maxTimeBetweenSwipes ){
		if( !( recognizer instanceof SwipeDetector ) ) throw new Error('first parameter is not a recognizer');
		this.recognizer = recognizer;
		this.maxTimeBetweenSwipes = maxTimeBetweenSwipes || 200;

		this.init();
	}
	
	extend( TwoSwipeDetector.prototype, EventListener );
	extend( TwoSwipeDetector.prototype, {
		init : function(){
			this.recognizer.bind('swipeleft', twoswipeleft.bind(this) );
			this.recognizer.bind('swiperight', twoswiperight.bind(this) );
			this.recognizer.bind('swipeup', twoswipeup.bind(this) );
			this.recognizer.bind('swipedown', twoswipedown.bind(this) );
		}
	});
	
	var twoswipeleft = TwoSwipeDetectorGenerator('left');
	var twoswiperight = TwoSwipeDetectorGenerator('right');
	var twoswipeup = TwoSwipeDetectorGenerator('up');
	var twoswipedown = TwoSwipeDetectorGenerator('down');
	
	function TwoSwipeDetectorGenerator( direction_str ){
		var last_time = 'last_time_' + direction_str;
		var eventName = 'twoswipe' + direction_str;
	
		return function(){
			var now = new Date;

			// if this is not the first touch				
			if( typeof this[last_time] !== 'undefined' ){
				var elapsedTime = now - this[last_time];
				console.log( elapsedTime );
				
				if( elapsedTime <= this.maxTimeBetweenSwipes ){
					this.trigger( eventName );
				}
			}

			this[last_time] = now;
		}
	}
	
	return TwoSwipeDetector;
})();

var CircularDetector = (function(){
	function CircularDetector( clockHandCounter, distanceCounter, threshold, restraint ){
		if( !(clockHandCounter instanceof ClockHandCounter)){
			throw new Error('first param is not ClockHandCounter');
		}
		
		if( !(distanceCounter instanceof DistanceCounter)){
			throw new Error('second param is not DistanceCounter');
		}
		
		if( clockHandCounter.recognizer != distanceCounter.recognizer ){
			throw new Error('ClockHandCounter and DistanceCounter parent is not the same');
		}
		
		this.clock_hand_counter = clockHandCounter;
		this.distance_counter = distanceCounter;
		this.threshold = threshold || 100;
		this.threshold_square = this.threshold*this.threshold;
		/** restraint
		  *    maximum percentage of the distance between start and end point to be considered a close loop over the maximum distance
		  *    example : 
		  *      r = restraint
		  *      d = distance(end-start)
		  *      m = maxDistance( alltouches relative to start )
		  *      if( d < m*r )
		*/
		this.restraint = restraint || 0.4; 
		this.restraint_square = this.restraint * this.restraint;
		this.init();
	}
	
	extend( CircularDetector.prototype, EventListener );
	extend( CircularDetector.prototype, {
		init : function(){
			this.distance_counter.bind('touchstart', touchstart.bind(this));
			this.distance_counter.bind('touchmove', touchmove.bind(this));
		}
	});
	
	function touchstart( touch, cache ){
		cache.max_square_distance = -1;
		cache.amplitudeX = -1;
		cache.amplitudeY = -1;
	}

	function touchmove( touch, cache ){
		if( cache.max_square_distance < cache.squareDistance ){
			cache.max_square_distance = cache.squareDistance;
		}
		if( cache.amplitudeX < Math.abs(cache.distanceX) ){
			cache.amplitudeX = Math.abs(cache.distanceX);
		}
		if( cache.amplitudeY < Math.abs(cache.distanceY) ){
			cache.amplitudeY = Math.abs(cache.distanceY);
		}
		
		var maxsquare = cache.max_square_distance;
		var square = cache.squareDistance;
		var ccwcount = cache.ccwcount;
		var cwcount = cache.cwcount;
		var total = ccwcount + cwcount;
		var minimumPercentage = 0.7;
		var minimumCount = Math.floor( minimumPercentage * total );

		if( maxsquare > this.threshold_square && 
			square < this.restraint_square * maxsquare && 
			Math.max( ccwcount, cwcount ) >= minimumCount 
			){
			this.trigger('circular', Math.sqrt(maxsquare), cache.amplitudeX, cache.amplitudeY, ccwcount, cwcount );
			
			// force reset data
			cache.ccwcount = 0;
			cache.cwcount = 0;
			cache.max_square_distance = -1;
		}
	}
		
	return CircularDetector;
})();


var RotationDetector = (function(){
	var RotationDetector = function( recognizer, cx, cy, inner, outter ){
		if( !( recognizer instanceof ClockHandCounter ) ) 
			throw new Error('first parameter is not a recognizer');
		this.recognizer = recognizer;

		this.centerX = cx;
		this.centerY = cy;
		
		if( outter <= inner ) 
			throw new Error('innerRadius have to be bigger than outter radius');
		
		this.innerRadius = inner;
		this.outterRadius = outter;
		
		this.init();
	}
	
	extend( RotationDetector.prototype, EventListener );
	extend( RotationDetector.prototype, {
		init : function(){
			this.recognizer.bind('touchmove', updateTouch.bind(this));
		}
	});
	
	function updateTouch( touch, cache ){
		var ax = this.centerX - cache.lastone.x;
		var ay = this.centerY - cache.lastone.y
		
		var bx = this.centerX - cache.lasttwo.x;
		var by = this.centerY - cache.lasttwo.y;
		
		var ar = Math.sqrt( ax*ax + ay*ay );
		var br = Math.sqrt( bx*bx + by*by );
		
		var drad = Math.acos( (ax*bx+ay*by) / ar / br );

		if( drad > 0 )
			this.trigger('ccw', drad );
		else
			this.trigger('cw', drad );			
			
		this.trigger('rotation', drad );
	}
	
	return RotationDetector;
})();


