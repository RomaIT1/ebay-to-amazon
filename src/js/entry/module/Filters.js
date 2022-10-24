export default class Filters {
	mainContent = document.querySelector("#mainContent");
	cardProductItem = Array.from(document.querySelectorAll(".s-item")).slice(1);
	currentTab = null;
	tabsList = [
		{ name: "bad-sellers", label: "Bad sellers" },
		{ name: "good-sellers", label: "Good sellers" },
		{ name: "multiple-sold", label: "Multiply sold" },
		{ name: "not-sold", label: "Not sold" },
	];
	displaySellers = [];
	constructor(options) {
		this.init();
	}

	async init() {
		await this.loadProductInfo();

		this.filterTabsBar = this.createFilterTabs();
		this.filterTabs = this.filterTabsBar.querySelectorAll(".ext-tabs__item");
		this.filterTabs.forEach(this.tabAction.bind(this));

		console.log(this.displaySellers);
	}

	loadProductInfo() {
		function promiseWrapper(resolve) {
			this.cardProductItem.forEach(async (item, index) => {
				await this.getSellerInfo(item, index);

				if (this.displaySellers.length === this.cardProductItem.length) {
					resolve();
				}
			});
		}

		return new Promise(promiseWrapper.bind(this));
	}

	async getSellerInfo(item, index) {
		const linkNode = item.querySelector(".s-item__link");

		const productId = linkNode
			.getAttribute("href")
			.split("/")
			[linkNode.getAttribute("href").split("/").length - 1].split("?")[0];

		const itemInfo = await this.getSellerFetch(productId);

		item.setAttribute("data-product-id", productId);

		this.displaySellers.push(itemInfo);
	}

	async getSellerFetch(id) {
		const res = await fetch(`https://www.ebay.com/itm/${id}`);
		const page = await res.text();

		const innerNode = document.createElement("div");
		innerNode.innerHTML = page;

		const seller = innerNode
			.querySelector("a[href^='https://ocswf.ebay.com/rti/compose?seller=']")
			.getAttribute("href")
			.split("=")[1]
			.split("&")[0];

		const feedback = Math.round(
			+innerNode
				.querySelector("a[href='#LISTING_FRAME_MODULE']")
				.textContent.trim()
				.split(" ")[0]
				.replace("%", "")
		);

		const sold = innerNode.querySelector(".vi-txt-underline");

		const dataObject = {
			seller,
			feedback,
			id,
			sold: sold ? +sold.textContent.split(" ")[0] : 0,
		};

		innerNode.remove();

		return dataObject;
	}

	tabAction(item, index) {
		const tabLink = item.querySelector(".ext-tabs__link");

		tabLink.addEventListener("click", this.tabSelect.bind(this, item, index));
	}

	tabSelect(item, index, event) {
		event.preventDefault();

		if (index === this.currentTab) {
			item.classList.remove("active");
			this.currentTab = null;
		} else {
			this.tabUnSelectedAll();
			item.classList.add("active");
			this.currentTab = index;
		}

		this.unSelectedItemAll();

		if (!this.tabsList[this.currentTab]) return;

		// if (this.tabsList[this.currentTab].name === "good-sellers") {
		// 	this.displaySellers.forEach((item, index) => {
		// 		if (item.feedback >= 95) {
		// 			document
		// 				.querySelector(`li[data-product-id="${item.id}"]`)
		// 				.classList.add("selected");
		// 		}
		// 	});
		// } else if (this.tabsList[this.currentTab].name === "bad-sellers") {
		// 	this.displaySellers.forEach((item, index) => {
		// 		if (item.feedback <= 95) {
		// 			document
		// 				.querySelector(`li[data-product-id="${item.id}"]`)
		// 				.classList.add("selected");
		// 		}
		// 	});
		// }

		if (this.tabsList[this.currentTab].name === "multiple-sold") {
			this.displaySellers.forEach((item, index) => {
				if (item.sold >= 1) {
					document
						.querySelector(`li[data-product-id="${item.id}"]`)
						.classList.add("selected");
				}
			});
		} else if (this.tabsList[this.currentTab].name === "not-sold") {
			this.displaySellers.forEach((item, index) => {
				if (item.sold === 0) {
					document
						.querySelector(`li[data-product-id="${item.id}"]`)
						.classList.add("selected");
				}
			});
		}
	}

	unSelectedItemAll() {
		this.cardProductItem.forEach((item, index) => {
			item.classList.remove("selected");
		});
	}

	tabUnSelectedAll() {
		this.filterTabs.forEach((item) => {
			item.classList.remove("active");
		});
	}

	createFilterTabs() {
		function _renderList(list) {
			let html = "";

			list.forEach((item, index) => {
				html += /*html*/ `
					<li class="ext-tabs__item">
						<a class="ext-tabs__link" data-tab-name="${item.name}" data-tab-id="${index}" href="#">${item.label}</a>
					</li>
				`;
			});

			return html;
		}

		const filterTabs = document.createElement("section");

		filterTabs.classList.add("ext-filter");
		filterTabs.insertAdjacentHTML(
			"afterbegin",
			/*html*/ `
			<div class="ext-filter__inner">
				<ul class="ext-filter__tabs ext-tabs">
					${_renderList(this.tabsList)}
				</ul>
			</div>
		`
		);
		this.mainContent.prepend(filterTabs);

		return filterTabs;
	}
}
