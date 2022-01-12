const { map, icon, marker, tileLayer } = L;

export default class LeafletMap {
	constructor(id) {
		this.id = id;
		this.$ = document.getElementById(id);
		this.options = Object.assign(this.loadOptionsDefault(), {...this.$.dataset});

		if(!this.options.centerX || !this.options.centerY) {
			throw new Error('Не заданы обязательные атрибуты data-center-x и data-center-y');
		}

		this.markers = Array.from(this.$.querySelectorAll("[data-x]"))
			.filter(point => point.dataset.x && point.dataset.y)
			.map(point => ({
				desc: point.innerHTML.trim() || false,
				...point.dataset
			}));
		this.$.innerHTML = "";

		this.init();
	}

	init() {
		this.map = map(this.id).setView([this.options.centerX, this.options.centerY], this.options.zoom);
		this.defaultIcon = this.createIcon();
		this.markers.forEach(point => this.addMarker(point)); // Добавляем маркеры

		// Добавляем подпись под картой
		tileLayer(this.options.api, {
			attribution: this.options.desc,
		}).addTo(this.map);

		if(!this.options.isScroll) this.map.scrollWheelZoom.disable(); // проверяем, надо ли отрубать скролл
	}

	/**
	 * Загрузить список опций по умолчанию
	 *
	 * @returns {{iconHeight: number, ico: string, iconWidth: number, isScroll: boolean, zoom: number, api: string, desc: string}}
	 */
	loadOptionsDefault() {
		return {
			api: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
			zoom: 16,
			ico: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='438.536' height='438.536'%3E%3Cpath d='M322.621 42.825C294.073 14.272 259.619 0 219.268 0c-40.353 0-74.803 14.275-103.353 42.825-28.549 28.549-42.825 63-42.825 103.353 0 20.749 3.14 37.782 9.419 51.106l104.21 220.986c2.856 6.276 7.283 11.225 13.278 14.838 5.996 3.617 12.419 5.428 19.273 5.428 6.852 0 13.278-1.811 19.273-5.428 5.996-3.613 10.513-8.562 13.559-14.838L356.02 197.284c6.282-13.324 9.424-30.358 9.424-51.106.005-40.353-14.268-74.8-42.823-103.353zm-51.679 155.03c-14.273 14.272-31.497 21.411-51.674 21.411s-37.401-7.139-51.678-21.411c-14.275-14.277-21.414-31.501-21.414-51.678 0-20.175 7.139-37.402 21.414-51.675 14.277-14.275 31.504-21.414 51.678-21.414 20.177 0 37.401 7.139 51.674 21.414 14.274 14.272 21.413 31.5 21.413 51.675 0 20.175-7.138 37.398-21.413 51.678z'/%3E%3C/svg%3E",
			iconWidth: 30,
			iconHeight: 30,
			desc: "",
			isScroll: false,
		};
	}

	createIcon(ico) {
		return icon({
			iconUrl: ico || this.options.ico,
			iconSize: [this.options.iconWidth, this.options.iconHeight],
			iconAnchor: [this.options.iconWidth/2, this.options.iconHeight],
			popupAnchor: [0, -this.options.iconHeight]
		});
	}

	addMarker(point) {
		const newMarker = marker([point.x, point.y], { icon: point.ico || this.defaultIcon }).addTo(this.map);

		if(point.desc) {
			newMarker.bindPopup(point.desc);
		}
	}
}
