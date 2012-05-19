function line (x, y, x1, y1, color){
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.stroke();
}

function drawCircle(x, y, r, color) {
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI, false);
    context.strokeStyle = color;
    context.stroke();    
}

function drawSegment(mline, color){
    if (mline.B == 0) {
        var x = -mline.C/mline.A;
        line (x, -10, x, height, color);
    } else if (mline.A == 0) {
        var y = -mline.C/mline.B;
        line (-10, y, width, y, color);
    } else {
        var k = -mline.A/mline.B,
        b = -mline.C/mline.B;
        
        line (-10, -10 * k + b, width, width * k + b, color);
    }
}

math.Segment.prototype.draw = function(color) {
    line (this.a.x, this.a.y, this.b.x, this.b.y, color);
}

math.DPoint.prototype.draw = function(color) {
    drawCircle(this.x, this.y, 1, color);
}

math.Circle.prototype.draw = function(color) {
    drawCircle(this.x, this.y, this.r, color);
}

phys.Reflector.prototype.draw = function(color) {
    for (var i = 0; i < this.items.length; i++){
        this.items[i].draw(color);
    }
}

phys.Lens.prototype.draw = function(color) {
    this.segment.draw(color);
    var lnorm = this.segment.norm().scale(this.segment.length());
    
    line (this.segment.middle().x - lnorm.x, this.segment.middle().y - lnorm.y,
          this.segment.middle().x + lnorm.x, this.segment.middle().y + lnorm.y, 'grey');
}

LineGenerator.prototype.draw = function(color) {
    this.segment.draw(color);
}