function phys(){
    
    
    this.Reflector = function(items){
        
        this.items = items;
        
        
        this.collide = function(dpoint) {
            for (var i = 0; i < this.items.length; i++){
                if (this.items[i].intersects(dpoint.seg())) {
                    return dpoint.vector.reflect(items[i].norm(dpoint))
                }
            }
            
            return false;
        }
    }
    
    this.Lens = function(segment, d){
        
        var middle = segment.middle();

        this.segment = segment;
        this.d = d;
        
        this.f = {
            x: middle.x + this.segment.norm().x/d, 
            y: middle.y + this.segment.norm().y/d
        };
        this.fplane = new math.Line(this.f.x, this.f.y,
                                    this.f.x - this.segment.line.B,
                                    this.f.y + this.segment.line.A)
        
        this.f1 = {
            x: middle.x - this.segment.norm().x/d, 
            y: middle.y - this.segment.norm().y/d
        }
        this.fplane1 = new math.Line(this.f1.x, this.f1.y, 
                                     this.f1.x - this.segment.line.B,
                                     this.f1.y + this.segment.line.A)
        
        this.collide = function(dpoint){
            if (this.segment.intersects(dpoint.seg())) {
                

                var f  = this.f1;
                var fp = this.fplane1;
                
                if (this.segment.line.norm().mul(dpoint.vector) > 0){
                    f  = this.f;
                    fp = this.fplane;
                }
                
                var middle = this.segment.middle();
                var vp = new math.Line(middle.x, middle.y,
                                       middle.x + dpoint.vector.x,
                                       middle.y + dpoint.vector.y).intersection(fp);
                
                    var dv = new math.Vector(vp.x - dpoint.x, vp.y - dpoint.y).norm();
                    return dv.scale((this. d < 0 ? -1 : 1) * dpoint.vector.length());
                
            }
            return false;
        }
    }
}

(function(){
    phys = new phys(); 
    
})();