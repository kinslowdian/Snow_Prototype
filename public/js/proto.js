var trace = function(msg){ console.log(msg); };

var viewer;
var display;
var sky;
var lib;
var timer;
var eventList;

var fx;


var Snowing = function(v)
{
	this.flakeList = null;
	this.max = v;
}

Snowing.prototype.build = function()
{
	this.flakeList = new Array();
}

var Flake = function()
{
	this.instanceName = null;
};

Flake.prototype.build = function(n)
{
	// SOURCE & NAME
	this.html = getAsset("snow");
	this.instanceName = 'flake_' + n;
	this.arrayRef = n;

	// BASIC
	this.dimensions = Math.round(Math.random() * (6 - 1) + 1);
	this.weight = Math.round(Math.random() * (100 - 4) + 4) / 100;

	// X & Y
	this.positioning 		= {};
	this.positioning.x 	= Math.round(Math.random() * viewer.w);
	this.positioning.yb = Math.round(Math.random() * ((viewer.h - 10) - 10) + 10);
	this.positioning.ys = Math.round(Math.random() * (-10 - -(viewer.h * 0.25)) + -(viewer.h * 0.25));
	this.positioning.ye = Math.round(Math.random() * ((viewer.h + (viewer.h * 0.25)) - viewer.h) + viewer.h);

	this.duration = Math.round(Math.random() * (8000 - 2000) + 2000);

	this.refreshDelay;
}

Flake.prototype.reference = function (o, i)
{
	this.outer = o;
	this.inner = i;
}

function start_init(event)
{
	viewer = {};
	viewer.w = screen.width;
	viewer.h = screen.height;

	var particleHTML = "";
	var particleCount = 0;

	display = document.querySelector("#display");
	sky = display.querySelector(".sky");

	lib = document.querySelector(".lib");

	fx = new Snowing(300);
	fx.build();

	trace(this);

	for(var i = 0; i < fx.max; i++)
	{
		var f = new Flake();
		f.build(i);

		fx.flakeList.push(f);

		particleHTML += fx.flakeList[i].html;

		particleCount++;
	}

	sky.innerHTML = particleHTML;

	for(var j = 0; j < particleCount; j++)
	{
		var fl = sky.children[j];

		fl.classList.add(fx.flakeList[j].instanceName);

		var _ou = sky.querySelector('.' + fx.flakeList[j].instanceName);
		var _in = _ou.querySelector(".snow");

		fx.flakeList[j].reference(_ou, _in);

		fx.flakeList[j].outer.style.width 			= fx.flakeList[j].dimensions + 'px';
		fx.flakeList[j].outer.style.height 		= fx.flakeList[j].dimensions + 'px';
		fx.flakeList[j].outer.style.opacity		= fx.flakeList[j].weight;
		fx.flakeList[j].outer.style.transform	= 'translateX(' + fx.flakeList[j].positioning.x + 'px)';

		fx.flakeList[j].inner.style.transform = 'translateY(' + fx.flakeList[j].positioning.yb + 'px)';

		fx.flakeList[j].inner.style.transitionDuration = fx.flakeList[j].duration + 'ms';
	}

	timer = setTimeout(animate_init, 1 * 1000);
}

function animate_init()
{
	eventList = new Array();

	for(var i = 0; i < fx.flakeList.length; i++)
	{
		var fl = document.querySelector('.' + fx.flakeList[i].instanceName);
		var sn = fl.querySelector(".snow");

		sn.style.transform = 'translateY(' + fx.flakeList[i].positioning.ye + 'px)';
		sn.addEventListener("transitionend", animate_event, false);
		eventList.push(sn);
	}
}

function animate_event(event)
{
	var eventFlake = event.target.parentElement.classList[1];

	trace(eventFlake);

	for(var i = 0; i < fx.flakeList.length; i++)
	{
		var searchFlake;

		if(eventFlake === fx.flakeList[i].instanceName)
		{
			searchFlake = document.querySelector('.' + fx.flakeList[i].instanceName);
			searchFlake.querySelector(".snow").style.transform = 'translateY(' + fx.flakeList[i].positioning.ys + 'px)';
			searchFlake.querySelector(".snow").style.transitionDuration = "0ms";

			// searchFlake.querySelector(".snow").style.transform = 'translateY(' + fx.flakeList[i].positioning.ye + 'px)';
			// searchFlake.querySelector(".snow").style.transitionDuration = fx.flakeList[i].duration + 'ms';

			fx.flakeList[i].refreshDelay = setTimeout(animate_recyle, 20, searchFlake, i);

			break;
		}
	}
}

function animate_recyle(el, index)
{
	trace(el + " " + index);

	el.querySelector(".snow").style.transform = 'translateY(' + fx.flakeList[index].positioning.ye + 'px)';
	el.querySelector(".snow").style.transitionDuration = fx.flakeList[index].duration + 'ms';
}

function getAsset(str)
{
	var html = "";

	html = lib.querySelector('.lib-' + str).innerHTML;

	return html;
}