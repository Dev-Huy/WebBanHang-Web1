let phieuNhapList = [];
let productList = [];
let account = [];


async function loadData(url, key) {
  const cached = localStorage.getItem(key);
  if (cached) return JSON.parse(cached);

  const res = await fetch(url);
  const data = await res.json();

  localStorage.setItem(key, JSON.stringify(data));
  return data;
}



async function loadProductList() {
  const data = await loadData("./json/SanPham.json", "products");
  for (const i of data) {
    const object = {
      id: i.id,
      name: i.name,
      total: i.total
    };
    productList.push(object);
  }
}

async function loadPhieuNhap() {
  const data = await loadData("./json/phieuNhap.json", "goodsReceipts");
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
      status: i.status,
      phone: i.phone,
      id: i.id,
      created: new Date(i.created)
    }
    account.push(object);
  }
}


let order = [];
async function loadOrder() {
  const data = await loadData("./json/donhang.json", "orders");
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

function synchronize() {
  phieuNhapList.forEach(i => {
    i.productlist.forEach(j => {
      const productFind = productList.find(h => (j.id === h.id));
      productFind.total += (productFind.total === 0) ? j.amount : 0;
    })
  })
  order.forEach(i => {
    i.chitiet.forEach(j => {
      const productFind = productList.find(h => (h.id === j.id));
      productFind.total -= j.soluong;
    })
  })
}

export const ready = (async () => {
  await loadPhieuNhap();
  await loadProductList();
  await loadOrder();
  synchronize();
  await loadAccount();
})();

export { phieuNhapList, productList, account, order };