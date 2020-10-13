const ShoppingCart = require('../src/ShoppingCart.js')

const {
  DISCOUNT10,
  DISCOUNT15,
  DISCOUNT20,
  BULKBUY2GET1
} = require('../src/constant.js');

describe('should run the app', function() {

  it('should return all products', function() {
    const products = require('../src/data/products.json')
    expect(products.length).toEqual(12);
    expect(products[0].productCode).toEqual("CHAIR_RED");
    expect(products[1].productCode).toEqual("DIS_10-CHAIR_BLUE");
  });

  describe('when the discount is 10 percent', function() {
    let results = {};

    beforeAll(function() {
      const item = {name: "foo", price: "10", productCode: DISCOUNT10}
      const shoppingCart = new ShoppingCart([item]);
      results = shoppingCart.checkout();
    });

    it('gets the right price', function() {
      expect(results.totalPrice).toEqual(9);
    });

    it('gets the right loyalty points', function() {
      expect(results.loyaltyPoints).toEqual(1);
    });
  });

  describe('when the discount is 15 percent', function() {
    let results = {};

    beforeAll(function() {
      const item = {name: "bar", price: "74.99", productCode: DISCOUNT15}
      const shoppingCart = new ShoppingCart([item]);
      results = shoppingCart.checkout();
    });

    it('gets the right price', function() {
      const totalPrice = results.totalPrice.toFixed(2);
      expect(totalPrice).toEqual("63.74");
    });

    it('gets the right loyalty points', function() {
      const loyaltyPoints = results.loyaltyPoints.toFixed(2);
      expect(loyaltyPoints).toEqual("5.00");
    });
  });

  describe('when the discount is 20 percent', function() {
    let results = {};

    beforeAll(function() {
      const item = {name: "screen", price: "88.99", productCode: DISCOUNT20}
      const shoppingCart = new ShoppingCart([item]);
      results = shoppingCart.checkout();
    });

    it('gets the right price', function() {
      const totalPrice = results.totalPrice.toFixed(2);
      expect(totalPrice).toEqual("71.19");
    });

    it('gets the right loyalty points', function() {
      const loyaltyPoints = results.loyaltyPoints.toFixed(2);
      expect(loyaltyPoints).toEqual("4.45");
    });
  });

  describe('when purchase has an offer on group of products', function() {
    let results = {};
    const item = { name: "foo", price: "25.99", productCode: BULKBUY2GET1+"-FOO" };

    describe('when just has one type of product in offer', function() {
      let items = [item, item];

      describe('when the size of products are in in the offer', function() {
        beforeAll(function() {
          const shoppingCart = new ShoppingCart(items);
          results = shoppingCart.checkout();
        });

        it('gets the right price', function() {
          const totalPrice = results.totalPrice.toFixed(2);
          expect(totalPrice).toEqual("25.99");
        });

        it('gets the right loyalty points', function() {
          const loyaltyPoints = results.loyaltyPoints.toFixed(2);
          expect(loyaltyPoints).toEqual("5.20");
        });
      });

      describe('when the size of products are not all in in the offer', function() {
        beforeAll(function() {
          items.push(item);
          const shoppingCart = new ShoppingCart(items);
          results = shoppingCart.checkout();
        });

        it('gets the right price', function() {
          const totalPrice = results.totalPrice.toFixed(2);
          expect(totalPrice).toEqual("51.98");
        });

        it('gets the right loyalty points', function() {
          const loyaltyPoints = results.loyaltyPoints.toFixed(2);
          expect(loyaltyPoints).toEqual("10.40");
        });
      });
    });

    describe('when just ha several types of product in offer', function() {
      const item2 = { name: "bar", price: "33.99", productCode: BULKBUY2GET1+"-BAR" };
      let items = [item, item, item2, item2];

      describe('when the size of products are in in the offer', function() {
        beforeAll(function() {
          const shoppingCart = new ShoppingCart(items);
          results = shoppingCart.checkout();
        });

        it('gets the right price', function() {
          const totalPrice = results.totalPrice.toFixed(2);
          expect(totalPrice).toEqual("59.98");
        });

        it('gets the right loyalty points', function() {
          const loyaltyPoints = results.loyaltyPoints.toFixed(2);
          expect(loyaltyPoints).toEqual("12.00");
        });
      });

      describe('when the size of products are not all in in the offer', function() {
        beforeAll(function() {
          items.push(item);
          items.push(item2);
          const shoppingCart = new ShoppingCart(items);
          results = shoppingCart.checkout();
        });

        it('gets the right price', function() {
          const totalPrice = results.totalPrice.toFixed(2);
          expect(totalPrice).toEqual("119.96");
        });

        it('gets the right loyalty points', function() {
          const loyaltyPoints = results.loyaltyPoints.toFixed(2);
          expect(loyaltyPoints).toEqual("23.99");
        });
      });
    });
  });


  describe('when total purchase is above 500', function() {
    let results = {};

    beforeAll(function() {
      const items = [
        {name: "computer", price: "415.99", productCode: DISCOUNT15},
        {name: "desktop", price: "228.55", productCode: DISCOUNT10}
      ]
      const shoppingCart = new ShoppingCart(items);
      results = shoppingCart.checkout();
    });

    it('gets the right price', function() {
      const totalPrice = results.totalPrice.toFixed(2);
      expect(totalPrice).toEqual("531.32");
    });

    it('gets the right loyalty points', function() {
      const loyaltyPoints = results.loyaltyPoints.toFixed(2);
      expect(loyaltyPoints).toEqual("50.59");
    });
  });

  describe('when purchase has an offer on group of products but by price', function() {
    let results = {};
    const item = { name: "foo", price: "25.99", productCode: BULKBUY2GET1+"-FOO" };
    const item2 = { name: "bar", price: "33.99", productCode: BULKBUY2GET1+"-BAR" };
    const item3 = { name: "foobar", price: "66.99", productCode: BULKBUY2GET1+"-FOO-BAR" };
    items = [item, item3];

    describe('when the size of products are in in the offer', function() {
      beforeAll(function() {
        const shoppingCart = new ShoppingCart(items);
        results = shoppingCart.checkout();
      });

      xit('gets the right price', function() {
        const totalPrice = results.totalPrice.toFixed(2);
        expect(totalPrice).toEqual("66.99");
      });

      xit('gets the right loyalty points', function() {
        const loyaltyPoints = results.loyaltyPoints.toFixed(2);
        expect(loyaltyPoints).toEqual("13.40");
      });
    });

    describe('when the size of products are not all in in the offer', function() {
      beforeAll(function() {
        items.push(item2);
        const shoppingCart = new ShoppingCart(items);
        results = shoppingCart.checkout();
      });

      xit('gets the right price', function() {
        const totalPrice = results.totalPrice.toFixed(2);
        expect(totalPrice).toEqual("100.98");
      });

      xit('gets the right loyalty points', function() {
        const loyaltyPoints = results.loyaltyPoints.toFixed(2);
        expect(loyaltyPoints).toEqual("20.20");
      });
    });
  });

  describe('when they are selling table & chair package with 20 discount', function () {
    beforeAll(function() {
      items = [
        { name: "foo", price: 25.99, productCode: "PACKAGE_20_CHAIR_PACKAGE" },
        { name: "bar", price: 25.99, productCode: "PACKAGE_20_TABLE_PACKAGE" }
      ];
      const shoppingCart = new ShoppingCart(items);
      results = shoppingCart.checkout();
    });

    it("when table and chair apply discount of 20 dollars", () => {
      const expected  = "31.98"
      const actualPrice = results.totalPrice.toFixed(2);
      expect(actualPrice).toEqual(expected)
    })
  });
});
