import * as THREE from 'three';
import { bindable } from 'aurelia-framework';
import { getLogger } from 'aurelia-logging';
import { ThreeCustomElement} from './three';
const log = getLogger('three-cube-view');

export class ThreeCubeView {

  @bindable three: ThreeCustomElement;

  private controls: any;
  public host: HTMLElement; // comes from template
  private observing: boolean = false;

  public bind() {
    this.threeChanged();
  }

  public startObserving() {
    if (this.observing) {
      return;
    }
    this.observing = true;
    this.update();
  }

  public stopObserving() {
    this.observing = false;
  }

  private update() {
    requestAnimationFrame(() => {
      this.controls.update();
      if (this.observing) {
        this.update();
      }
    });
  }

  public threeChanged() {
    log.debug('cameraChanged', this.three.getCamera());
    this.stopObserving();
    if (this.controls) {
      delete this.controls;
    }
    if (!this.three.getCamera()) {
      return;
    }
    log.debug('create controls');
    this.controls = new (THREE as any).OrientationControls(this.three.getCamera(), 50, false);
    if (this.host.innerHTML) {
      this.host.innerHTML = '';
    }
    this.host.append(this.controls.element as HTMLElement);
    (this.controls.element as HTMLElement).addEventListener('click', this);
    this.startObserving();
  }

  public handleEvent(event: MouseEvent) {
    const id = (event.target && event.target instanceof HTMLElement) ? event.target.id : '';
    if (id === 'front' || id === 'back' || id === 'top' || id === 'bottom' || id === 'left' || id === 'right') {
      this.three.navigation.zoomOnScene(1, id, true);
    }
  }
}

export interface OrientationControlsOptions {
  perspective?: boolean;
}



(THREE as any).OrientationControls = (function () {

  function epsilon( value ) {

      return Math.abs( value ) < 1e-10 ? 0 : value;

  }

  function getObjectCSSMatrix( matrix ) {

      const elements = matrix.elements;
      const matrix3d = 'matrix3d(' +
          epsilon( elements[ 0 ] ) + ',' +
          epsilon( elements[ 1 ] ) + ',' +
          epsilon( elements[ 2 ] ) + ',' +
          epsilon( elements[ 3 ] ) + ',' +
          epsilon( -elements[ 4 ] ) + ',' +
          epsilon( -elements[ 5 ] ) + ',' +
          epsilon( -elements[ 6 ] ) + ',' +
          epsilon( -elements[ 7 ] ) + ',' +
          epsilon( elements[ 8 ] ) + ',' +
          epsilon( elements[ 9 ] ) + ',' +
          epsilon( elements[ 10 ] ) + ',' +
          epsilon( elements[ 11 ] ) + ',' +
          epsilon( elements[ 12 ] ) + ',' +
          epsilon( elements[ 13 ] ) + ',' +
          epsilon( elements[ 14 ] ) + ',' +
          epsilon( elements[ 15 ] ) +
          ')';


      return 'translate(-50%,-50%)' + matrix3d;

  }

  const matrix = new THREE.Matrix4;

  const sides = {
      front: 'rotateY(  0deg) translateZ(%SIZE)',
      right: 'rotateY( 90deg) translateZ(%SIZE)',
      back: 'rotateY(180deg) translateZ(%SIZE)',
      left: 'rotateY(-90deg) translateZ(%SIZE)',
      top: 'rotateX( 90deg) translateZ(%SIZE)',
      bottom: 'rotateX(-90deg) translateZ(%SIZE)'
  };

  const offsets = {
      n: [ 0, -1 ],
      e: [ 1, 0 ],
      s: [ 0, 1 ],
      w: [ -1, 0 ]
  };

  function OrientationControls(camera: THREE.Camera, size: number, options: OrientationControlsOptions ) {

      size = size || 80;
      options = options || {};

      const unit = 'px';
      const half = size / 2;


      options.perspective = options.perspective || false;

      const container = document.createElement( 'div' );

      container.className = 'three-cube-view__element';

      container.style.width = size + unit;
      container.style.height = size + unit;
      container.style.left = size / 2 + unit;
      container.style.top = size / 2 + unit;


      // Box

      const box = document.createElement( 'div' );

      box.className = 'three-cube-view__box';
      box.style.width = size + unit;
      box.style.height = size + unit;
      box.style.fontSize = ( size / 6 ) + unit;

      container.appendChild( box );


      // Ring + cardinal points

      const ring = document.createElement( 'div' );

      const R = 1.7320508075688772;
      const s = size * R / 2;

      const directions = {
          n: 'translateX(' + s + unit + ') translateY(' + 0 + unit + ')',
          e: 'translateX(' + s * 2 + unit + ') translateY(' + s + unit + ')',
          s: 'translateX(' + s + unit + ') translateY(' + s * 2 + unit + ')',
          w: 'translateX(' + 0 + unit + ') translateY(' + s + unit + ')'
      };

      function direction( name ) {

          const e = document.createElement( 'div' );

          const id = name.toLowerCase();

          const fs = size / 6;


          e.id = id;
          e.textContent = name;
          e.style.transform = directions[ id ];
          e.style.fontSize = fs + unit;
          e.style.left = ( -size / 2 / 6 - offsets[ id ][ 0 ] * fs ) + unit;
          e.style.top = ( -size / 2 / 6 - offsets[ id ][ 1 ] * fs ) + unit;

          ring.appendChild( e );
      }

      direction( 'N' );
      direction( 'E' );
      direction( 'S' );
      direction( 'W' );

      ring.className = 'ring';
      ring.style.transform = 'rotateX(90deg) translateZ(' + ( -size / 5 ) + unit + ') translateX(' + ( -size / 3 ) + unit + ')';
      ring.style.width = size * R + unit;
      ring.style.height = size * R + unit;

      box.appendChild( ring );


      // Sides

      function plane( side ) {

          const e = document.createElement( 'div' );

          const id = side.toLowerCase();

          e.id = id;
          e.textContent = side;
          e.className = id + ' face';

          e.style.width = size + unit;
          e.style.height = size + unit;
          e.style.transform = sides[ id ].replace( '%SIZE', ( size / 2 ) + unit );
          e.style.lineHeight = size + unit;

          box.appendChild( e );

          return e;

      }

      plane( 'Front' );
      plane( 'Right' );
      plane( 'Back' );
      plane( 'Left' );
      plane( 'Top' );
      plane( 'Bottom' );



      this.element = container;

      this.update = function () {

          matrix.copy( camera.matrixWorldInverse );

          matrix.elements[ 12 ] = half;
          matrix.elements[ 13 ] = half;
          matrix.elements[ 14 ] = 0;

          const style = getObjectCSSMatrix( matrix );

          // box.style.WebkitTransform = style;
          box.style.transform = style;

    container.style.perspective = ( ( options.perspective && camera instanceof THREE.PerspectiveCamera ) ?
    ( Math.pow( size * size + size * size, 0.5 ) / Math.tan( ( camera.fov / 2 ) * Math.PI / 180 ) ) : 0 ) + unit;

      };

  }

  return OrientationControls;

}());
