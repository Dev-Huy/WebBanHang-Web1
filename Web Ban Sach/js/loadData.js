let phieuNhapList = [];
let productList = [];
let account = [];


async function loadData(url, key) {
  const cached = localStorage.getItem(key);
  if (cached) return JSON.parse(cached);
  // isReload = true;
  const res = await fetch(url);
  const data = await res.json();

  localStorage.setItem(key, JSON.stringify(data));
  return data;
}



async function loadProductList() {
  const data = await loadData("./json/product.json", "products");
  for (const i of data) {
    const object = {
      id: i.id,
      title: i.title,
      img: (i.img === "") ? "./img/Error.png" : i.img,
      author: i.author,
      category: i.category,
      price: i.price,
      publicYear: i.publicYear,
      publisher: i.publisher,
      amount: i.amount,
      description: i.description,
      status: i.status
    };
    productList.push(object);
  }
}

async function loadPhieuNhap() {
  const data = await loadData("./json/goodsReceipt.json", "goodsReceipts");
  for (const i of data) {
    const object = {
      id: i.id,
      date: new Date(i.date),
      totalCost: i.totalCost,
      state: i.state,
      productlist: [...i.productlist]
    };
    phieuNhapList.push(object);
  }
}


async function loadAccount() {
  const data = await loadData('./json/account.json', "accounts");
  for (const i of data) {
    const object = {
      username: i.username,
      password: i.password,
      name: i.name,
      email: i.email,
      address: i.address,
      status: i.status,
      phone: i.phone,
      id: i.id,
      created: new Date(i.created)
    }
    account.push(object);
  }
}


let categoryList = [];
async function loadCategory() {
  const data = await loadData("./json/category.json", "categories");
  for (const i of data) {
    const object = {
      id: i.id,
      name: i.name
    }
    categoryList.push(object);
  }
}

let order = [];
async function loadOrder() {
  const data = await loadData("./json/order.json", "orders");
  for (const i of data) {
    const object = {
      id: i.id,
      username: i.username,
      ngay: new Date(i.ngay),
      tong: i.tong,
      trangthai: i.trangthai,
      chitiet: [...i.chitiet]
    }
    order.push(object);
  }
}

let isReload = performance.getEntriesByType("navigation")[0].type === "reload";
async function synchronize() {
  // Cộng thêm số lượng từ phiếu nhập
  phieuNhapList.forEach(phieu => {
    phieu.productlist.forEach(spNhap => {
      const productFind = productList.find(p => p.id === spNhap.id);
      if (productFind && !isReload) {
        // Nếu có hàng nhập, cộng thêm số lượng vào amount
        productFind.amount += spNhap.amount;
      }
    });
  });

  // Trừ số lượng từ đơn hàng
  order.forEach(don => {
    don.chitiet.forEach(spBan => {
      const productFind = productList.find(p => p.id === spBan.id);
      if (productFind && !isReload) {
        productFind.amount -= spBan.soluong;
      }
    });
  });
}

async function hashPassword(password) {
  // Chuyển string thành Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // Dùng crypto.subtle để hash SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Chuyển ArrayBuffer sang hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export const ready = (async () => {
  await loadPhieuNhap();
  await loadProductList();
  await loadOrder();
  await synchronize();
  await loadAccount();
  await loadCategory();
})();

export { loadData ,phieuNhapList, productList, account, order, categoryList, hashPassword };