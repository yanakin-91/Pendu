export default class Canvas {
	constructor (context) {
		this.context = context
	}

	draw (step) {
		switch (step) {
			case 0:
				this.context.moveTo(75, 225)
				this.context.lineTo(125, 225)
				this.context.stroke()
				break
			case 1: 
				this.context.moveTo(100, 225)
				this.context.lineTo(100, 25)
				this.context.stroke()
				break
			case 2:
				this.context.moveTo(100, 25)
				this.context.lineTo(175, 25)
				this.context.stroke()
				break
			case 3:
				this.context.moveTo(175, 25)
				this.context.lineTo(175, 75)
				this.context.stroke()
				break
			case 4:
				this.context.beginPath()
				this.context.arc(175, 85, 10, 0, 2 * Math.PI)
				this.context.stroke()
				break
			case 5: 
				this.context.moveTo(175, 95)
				this.context.lineTo(175, 140)
				this.context.stroke()
				break
			case 6:
				this.context.moveTo(175, 140)
				this.context.lineTo(150, 175)
				this.context.stroke()
				break
			case 7: 
				this.context.moveTo(175, 140)
				this.context.lineTo(200, 175)
				this.context.stroke()
				break
			case 8: 
				this.context.moveTo(175, 110)
				this.context.lineTo(150, 130)
				this.context.stroke()
				break
			case 9:
				this.context.moveTo(175, 110)
				this.context.lineTo(200, 130)
				this.context.stroke()
				break
			case 10:
				this.context.moveTo(100, 50)
				this.context.lineTo(125, 25)
				this.context.stroke()
				break
		}
	}
}