const cart = {
  actions: Object.freeze({
    ADD: Symbol("add"),
    REMOVE: Symbol("remove"),
    NOT_DEFINED: Symbol("not_defined")
  }),
  currency: '$',
  tax: 0.1,
  products: [],
  lastAction: null,

  refreshCart: function () {
    function addRow(tbody, index, value) {
      tbody.append($('<tr><th scope="row">' + index + '</th><td>' + value.name + '</td><td>' + cart.currency + value.cost + '</td></tr>'));
      const removeButton = $('<div class="glyphicon glyphicon-remove"></div>').click(function () {
        const tableCell = $(this).closest('td');
        cart.products.splice($(tableCell).siblings().first().text() - 1, 1);
        cart.lastAction = cart.actions.REMOVE;
        cart.refreshCart();
      });
      console.log($(':last-child', tbody));
      $('tr:last-child', tbody).append($('<td></td>').append(removeButton));
      cart.lastAction = cart.actions.NOT_DEFINED;
    }

    const tbody = $('#cart-table tbody');
    if (cart.lastAction === cart.actions.ADD) {
      addRow(tbody, cart.products.length, cart.products[cart.products.length - 1]);
    } else {
      tbody.empty();
      cart.products.forEach(function (value, index) {
        addRow(tbody, index + 1, value);
      })
    }

    if (cart.products.length !== 0) {
      $('#summary').removeClass('hidden');
      const subtotal = cart.products.reduce((acc, cur) => acc + parseFloat(cur.cost), 0);
      $('#subtotal').text(cart.currency + subtotal.toFixed(2));
      $('#tax').text(cart.currency + (cart.tax * subtotal).toFixed(2));
      $('#total').text(cart.currency + ((1 + cart.tax) * subtotal).toFixed(2));
    } else {
      $('#summary').addClass('hidden');
    }
  }

};

function setButtonsListeners() {
  const buyListener = function (){
    cart.products.push({
      name: $(this).parent().siblings().filter('.productName').text(),
      cost: $(this).text().substring($(this).text().indexOf('$') + 1)
    });
    cart.lastAction = cart.actions.ADD;
    cart.refreshCart();
  };
  $('button.buy').click(buyListener);

  const toShippingInfoListener = function () {
    $('#cart').addClass('hidden');
    $('#shipping-info').removeClass('hidden');
  };
  $('#to-shipping').click(toShippingInfoListener);

  const shippingFormListener = function () {
    const checkShippingInfo = function(){
      // TODO Maybe better to rewrite with array and Array.every()?

      if (!(/[a-z-]+\s[a-z-]+/i.test($('#name-input').val()))){
        return false;
      }
      if (!(/([\w.,-]+\s)*[\w.,-]+/i.test($('#address1-input').val()))){
        return false;
      }
      if (!(/([\w.,-]+\s)*/i.test($('#address2-input').val()))){
        return false;
      }
      if (!(/([\w.,-]+\s)*[\w.,-]+/i.test($('#city-input').val()))){
        return false;
      }
      if (!(/[\d-]+/i.test($('#zip-code-input').val()))){
        return false;
      }
      if (!(/([\w.,-]+\s)*[\w.,-]+/i.test($('#country-input').val()))){
        return false;
      }
      if (!(/([\w.,-]+\s)*[\w.,-]+/i.test($('#state-input').val()))){
        return false;
      }
      return true;
    };

    const valid = checkShippingInfo();
    if (valid) {
      alert('Order has been sent');
    }
    return valid;
  };
  $('#shipping-form').submit(shippingFormListener)
}

setButtonsListeners();
