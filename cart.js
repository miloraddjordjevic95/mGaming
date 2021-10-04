export class Cart {
    constructor() {
        this.items = new Array();
        this.number = 0;
        this.total = 0;
    }
}

export class CartItem {
    constructor(game, quantity = 1) {
      this.game = game;
      this.quantity = quantity;
    }
}