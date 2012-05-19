function LineGenerator(segment, mp, delay){
    
    this.segment = segment;
    this.maxPoints = mp;
    this.delay = delay;
    this.generated = 0;
    this.lastPTime = 0;
    
    this.generate = function(speed, amount) {
        var time = new Date().getTime();
        var k = arguments.length == 0 ? 1 : speed;
        var result = [];
        var pp = arguments.length == 2 ? amount : 1;
        
        
        if (this.generated < this.maxPoints && 
            (time - this.lastPTime) >= this.delay) {
            this.lastPTime = time;
            
            while (pp > 0 && this.generated < this.maxPoints) {
                this.generated++;
                pp--;
                var p = this.segment.randomPoint();
                result.push (new math.DPoint(p.x, p.y, this.segment.line.norm().scale(k)));
            }
        }
        
        return result;
    }
}