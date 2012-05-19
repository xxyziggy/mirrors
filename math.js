function math(){
    this.E = 0.0001;
    
    this.eq = function (a, b) {
        return Math.abs(a - b) < math.E;
    }
    this.length = function(x, y, x1, y1) {
        var lx = 0;
        var ly = 0;
        switch (arguments.length) {
            case 2:
                lx = x;
                ly = y;
                break;
            case 4:
                lx = x1 - x;
                ly = y1 - y;
                break;
            default:
                return 0;
        }
        
        return Math.sqrt(lx*lx + ly*ly);
    }
    
    this.det = function (x, y, x1, y1) {
        return x * y1 - y * x1;
    }
    
    this.Bounds = function (seg) {
        this.a = {
            x: Math.min(seg.a.x, seg.b.x),
            y: Math.min(seg.a.y, seg.b.y)
        };
        
        this.b = {
            x: Math.max(seg.a.x, seg.b.x),
            y: Math.max(seg.a.y, seg.b.y)
        };
        
        this.contains = function(p){
            if (math.eq(this.a.y, this.b.y)) {
                return p.x >= this.a.x && p.x <= this.b.x && math.eq(p.y, this.a.y);
            }
            if (math.eq(this.a.x, this.b.x)) {
                ;
                return p.y >= this.a.y && p.y <= this.b.y && math.eq(p.x, this.a.x);
            }            
            return p.x >= this.a.x && p.y >= this.a.y && 
            p.x <= this.b.x && p.y <= this.b.y;
        }
        
        this.toString = function(){
            return "[(" + this.a.x + ";" + this.a.y + "), (" + this.b.x + ";" + this.b.y + ")]"
        }
            
    }   
    
    this.Vector = function(x, y) {
        
        this.x = x;
        this.y = y;
        
        this.length = function() {
            if (!this.hasOwnProperty("_length")) {
                this._length = math.length(this.x, this.y);
            }
            
            return this._length;
        }
        
        this.norm = function(){
            if (!this.hasOwnProperty("_normal")) {
                if (this.length() == 0) {
                    return new math.Vector(0,0);
                }
                
                this._normal = new math.Vector(this.x / this.length(), 
                    this.y / this.length());                                             
            }
            
            return this._normal;
        }
        
        this.add = function(x, y) {
            if (arguments.length == 1) {
                return new math.Vector(this.x + x.x, this.y + x.y);
            }
            return new math.Vector(this.x + x, this.y + y);
        }
        
        this.mul = function(v) {
            return this.x*v.x + this.y*v.y;
        }
        
        this.scale = function(kx, ky){
            if (arguments.length == 1) {
                return new math.Vector(this.x * kx, this.y * kx);
            }
            return new math.Vector(this.x * kx, this.y * ky);
        }
        
        this.project = function(v){
            return v.scale(this.mul(v));
        }
        
        this.reflect = function(n) {
            return this.add(this.project(n).scale(-2));
        }
        
        this.collinear = function(v){
            return math.det(this.x, this.y, v.x, v.y);
        }
        
        this.toString = function(){
            return "(" + x + "; " + y + ")";
        }
    }
    
    this.Line = function(x, y, x1, y1){

        if (arguments.length == 4) {
            this.A = (y - y1);
            this.B = (x1 - x);
            this.C = (x * y1 - x1 * y);
        } else if (arguments.length == 3) {
            this.A = y - x1.y;
            this.B = x1.x - x;
            this.C = (x * x1.y - x1.x * y);
        }
        
        this.vector = function(){
            return new math.Vector(-this.B, this.A).norm();
        }
        
        this.norm = function(){
            return new math.Vector(this.A, this.B).norm();
        }
        
        this.distance = function (p){
            return Math.abs(p.x * this.A + p.y * this.B + this.C) / 
                   Math.sqrt(this.A * this.A + this.B * this.B);
        }
        
        this.intersection = function(line){
            if (Math.abs(math.det(this.A, this.B, line.A, line.B)) < math.E){
                return undefined;
            }
            
            return {
                x: - math.det(this.C, this.B, line.C, line.B)/
                math.det(this.A, this.B, line.A, line.B),
                y: - math.det(this.A, this.C, line.A, line.C)/
                math.det(this.A, this.B, line.A, line.B)                 
            }
        }
        
        this.toString = function(){
            return "[" + this.A + ", " + this.B + ", " + this.C +"]";
        }
    }
    
    this.Segment = function (x, y, x1, y1){
        
        this.line = new math.Line(x, y, x1, y1);
        this.a = {
            x: x, 
            y: y
        };
        this.b = {
            x: x1, 
            y: y1
        };
        this.middle = function(){
            return {
                x: (this.a.x + this.b.x) / 2,
                y: (this.a.y + this.b.y) / 2
            };
        }        
        
        this.norm = function(){
            return this.line.norm();
        }
        
        this.length = function(){
            return math.length(this.a.x, this.a.y, this.b.x, this.b.y);
        }
        
        this.intersects = function(seg) {
            
            var ip = this.line.intersection(seg.line);
            
            if (ip == undefined) {
                return false;
            }
            
            
            var segBounds = new math.Bounds(seg);
            var bounds    = new math.Bounds(this);

            //alert (segBounds + " and " + bounds + " cc " + ip.x +":" + ip.y + ": ina = " + segBounds.contains(ip)  + ", inb=" + bounds.contains(ip));
            return (segBounds.contains(ip) && bounds.contains(ip)) ? ip : undefined ;
        }
        
        this.randomPoint = function() {
            var px;
            var py;
            
            if (math.eq(this.a.x, this.b.x)) {
                px = this.a.x;
                py = Math.min(this.a.y, this.b.y) + Math.random() * Math.abs(this.a.y - this.b.y);
            } else if (math.eq(this.a.y, this.b.y)) {
                py = this.a.y;
                px = Math.min(this.a.x, this.b.x) + Math.random() * Math.abs(this.a.x - this.b.x);
            } else {
                px = Math.min(this.a.x, this.b.x) + Math.random() * Math.abs(this.a.x - this.b.x);
                py = -this.line.C/this.line.B - this.line.A/this.line.B * px;
            }
            
            return {
                x: px, 
                y:py
            };
        }
        
        this.toString = function(){
            return "[(" + this.a.x + ";" + this.a.y + "), (" + this.b.x + ";" + this.b.y + ")]"
        }
    }
    
    this.Circle = function (x, y, r) {
        
        this.x = x;
        this.y = y;
        this.r = r;
        
        this.intersects = function(seg){
            return (math.length(this.x, this.y, seg.a.x, seg.a.y) >= this.r &&
                math.length(this.x, this.y, seg.b.x, seg.b.y) <= this.r) ||
            (math.length(this.x, this.y, seg.a.x, seg.a.y) <= this.r &&
                math.length(this.x, this.y, seg.b.x, seg.b.y) >= this.r);
        }
        
        this.norm = function(p) {
            return new math.Vector(p.x - this.x, p.y - this.y).norm();
        }
        
    }
    
    this.DPoint = function (x, y, v) {
        this.vector = v;
        this.x = x;
        this.y = y;
        
        this.seg = function(kl){
            var k = arguments.length == 1 ? kl : 1;
            return new math.Segment(this.x, this.y, this.x + k * this.vector.x, this.y + k * this.vector.y);
        }
        
        this.toString = function(){
            return "(" + this.x + "; " + this.y + ")";
        }
    }
}

(function(){
    math = new math();   

    var s  = new math.Segment(0, 10, 10, 0);
    var s1 = new math.Segment(0, 0, 10, 10);
    
    if (!s.intersects(s1)) {
        alert ("Test failed");
    }
})();