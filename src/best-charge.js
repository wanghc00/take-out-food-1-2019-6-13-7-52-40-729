function bestCharge(selectedItems) {
  let result;
  let items = preProcessingData(selectedItems);
  let noneDiscountSubtotalInfo = countNoneDiscountSubtotal(items);
  let noneDiscountPay = countNoneDiscountPrice(noneDiscountSubtotalInfo);
  let priceOfReach30Reduce6 = noneDiscountPay;
  let priceOfUsingHalfPriceItems = noneDiscountPay;
  if(noneDiscountPay >= 30){
    priceOfReach30Reduce6 = countPriceByReach30Reduce6(noneDiscountPay);
  }
  let halfPriceItemsInfo = hasHalfPriceItems(items);
  if(halfPriceItemsInfo != null){
    priceOfUsingHalfPriceItems = countPriceBySpecifyItemsHalfPrice(halfPriceItemsInfo,noneDiscountPay);
  }
  if(priceOfReach30Reduce6 <= priceOfUsingHalfPriceItems){
    result = printReceipt(noneDiscountSubtotalInfo,noneDiscountPay,"满30减6元",priceOfReach30Reduce6,null);
  }else{
    result = printReceipt(noneDiscountSubtotalInfo,noneDiscountPay,"指定菜品半价",priceOfUsingHalfPriceItems,halfPriceItemsInfo);
  }
  return result;
}

function preProcessingData(selectedItems){
  //let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
  let result = [];
  for(let i = 0; i < selectedItems.length; i++){
    let itemAttribute = selectedItems[i].split("x");
    if(itemAttribute[0].trim() in result){
      result[itemAttribute[0].trim()] += parseInt(itemAttribute[1].trim());
    }else{
      result[itemAttribute[0].trim()] = parseInt(itemAttribute[1].trim());
    }
  }
  return result;
}


function countNoneDiscountSubtotal(items){
  var result = [];
  var allItems = loadAllItems();
  for(var item in items){
    for(let j = 0; j < allItems.length; j++){
      if(item == allItems[j].id){
        result.push({
          id:allItems[j].id,
          name:allItems[j].name,
          price:allItems[j].price,
          amount:items[item],
          subtotal:items[item] * allItems[j].price
        });
      }
    }
  }
  return result; 
}

function countNoneDiscountPrice(noneDiscountSubtotalInfo){
  let result = 0;
  for(let i = 0; i < noneDiscountSubtotalInfo.length; i++){
    result += noneDiscountSubtotalInfo[i].subtotal;
  }
  return result;
}

function hasHalfPriceItems(selecteditems){
  let result = [];
  let allItems = loadAllItems();
  let promotionInfo = loadPromotions();
  let promotionItems = promotionInfo[1].items;
  for(let item in selecteditems){
    if(promotionItems.indexOf(item)!=-1){
      for(let i = 0; i < allItems.length; i++){
        if(item == allItems[i].id){
          result.push({
            id:allItems[i].id,
            name:allItems[i].name,
            price:allItems[i].price,
            amount:selecteditems[item]
          });
        }
      }
    }
  }
  return result;
}

function countPriceByReach30Reduce6(noneDiscountPay){
  return noneDiscountPay - parseInt(noneDiscountPay/30)*6;
}

function countPriceBySpecifyItemsHalfPrice(halfPriceItems,noneDiscountPay){
  let result = 0;
  for(let i = 0; i < halfPriceItems.length; i++){
    result = result + halfPriceItems[i].amount * halfPriceItems[i].price;
  }
  return noneDiscountPay - result/2;
}

function printReceipt(noneDiscountSubtotalInfo,noneDiscountPay,str,discountPrcie,specifiedItems){
  let result=`============= 订餐明细 =============`;
  let specifiedItemStr="";
  let actualPay = noneDiscountPay;
  for(let i = 0; i < noneDiscountSubtotalInfo.length; i++){
    result += 
`
${noneDiscountSubtotalInfo[i].name} x ${noneDiscountSubtotalInfo[i].amount} = ${noneDiscountSubtotalInfo[i].subtotal}元`;
    //result = result + noneDiscountSubtotalInfo[i].name + " x " + noneDiscountSubtotalInfo[i].amount + " = " + noneDiscountSubtotalInfo.subtotal + "元\r\n-----------------------------------";
  }
  result += 
`
-----------------------------------`;
  if(discountPrcie < noneDiscountPay){
    actualPay = discountPrcie;
    if(str == "满30减6元"){
      result += 
`
使用优惠:
满30减6元，省${noneDiscountPay - discountPrcie}元
-----------------------------------`;
    }else if(str == "指定菜品半价"){
      for(let i = 0; i < specifiedItems.length; i++){
        specifiedItemStr = specifiedItemStr + specifiedItems[i].name+"，";
      }
      specifiedItemStr = specifiedItemStr.slice(0,-1);
      result += 
`
使用优惠:
指定菜品半价(${specifiedItemStr})，省${noneDiscountPay - discountPrcie}元
-----------------------------------`;
    }
  }

  result = result + 
`
总计：${actualPay}元
===================================`;
  return result;
}
