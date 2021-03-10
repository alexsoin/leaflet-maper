class LeafletMaper {
  constructor(id, options = {}) {
    this.id = id;
    this.$ = document.getElementById(id);

    const coorX = this.$.getAttribute('data-coor-x') || options.x || 55.751999;
    const coorY = this.$.getAttribute('data-coor-y') || options.x || 37.617734;
    
    this.api = options.api || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    this.zoom = options.zoom || 16;
    this.ico = options.ico || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='438.536' height='438.536'%3E%3Cpath d='M322.621 42.825C294.073 14.272 259.619 0 219.268 0c-40.353 0-74.803 14.275-103.353 42.825-28.549 28.549-42.825 63-42.825 103.353 0 20.749 3.14 37.782 9.419 51.106l104.21 220.986c2.856 6.276 7.283 11.225 13.278 14.838 5.996 3.617 12.419 5.428 19.273 5.428 6.852 0 13.278-1.811 19.273-5.428 5.996-3.613 10.513-8.562 13.559-14.838L356.02 197.284c6.282-13.324 9.424-30.358 9.424-51.106.005-40.353-14.268-74.8-42.823-103.353zm-51.679 155.03c-14.273 14.272-31.497 21.411-51.674 21.411s-37.401-7.139-51.678-21.411c-14.275-14.277-21.414-31.501-21.414-51.678 0-20.175 7.139-37.402 21.414-51.675 14.277-14.275 31.504-21.414 51.678-21.414 20.177 0 37.401 7.139 51.674 21.414 14.274 14.272 21.413 31.5 21.413 51.675 0 20.175-7.138 37.398-21.413 51.678z'/%3E%3C/svg%3E";
    this.iconSize = options.size || [30, 30];
    this.desc = options.desc || this.$.getAttribute('data-desc') || "zencod.ru";
    this.coor = [coorX, coorY];
    this.popup = options.popup;
    this.isScroll = options.scroll || false;

    this.create();
  }

  create() {
    const MAP = L.map(this.id).setView(this.coor, this.zoom);
    const ICON = L.icon({
      iconUrl: this.ico,
      iconSize: this.iconSize,
      iconAnchor: [this.iconSize[0]/2, this.iconSize[1]],
      popupAnchor: [0, -this.iconSize[1]]
    });
    const TILE = { maxZoom: this.zoom + 2 }
    const MARKER = L.marker(this.coor, { icon: ICON }).addTo(MAP);
    
    if(this.desc) TILE.attribution = this.desc;
    
    L.tileLayer(this.api, TILE).addTo(MAP);
    
    if(!this.isScroll) MAP.scrollWheelZoom.disable(); // проверяем, надо ли отрубать скролл
    if(this.popup) MARKER.bindPopup(this.popup); // проверяем, надо ли добавлять попап
  }
}