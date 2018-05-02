// Reduced from: https://github.com/MattJeanes/ngx-parallax/blob/master/lib/parallax.directive.ts

// ngx-parallax
import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  // tslint:disable-next-line
  selector: '[parallax]'
})
export class ParallaxDirective implements OnInit {
  @Input() imgAspectRatio: number;
  @Input() speed: number;
  @Input() top: number;
  @Input() left: number;

  private element: HTMLElement;
  private window: Window;
  private cssProperty = 'transform';

  constructor(element: ElementRef) {
    this.element = element.nativeElement;
  }

  ngOnInit() {
    this.window = window;
    this.addStyles();

    if (!this.imgAspectRatio) {
      this.imgAspectRatio = 1.5;
    }

    if (!this.speed) {
      this.speed = 7;
    }

    this.evaluateScroll();
    this.window.addEventListener('scroll', this.evaluateScroll.bind(this));

    this.setAspectRatio();
    this.window.addEventListener('resize', this.setAspectRatio.bind(this));
  }

  private addStyles() {
    // parent styles
    this.element.parentElement.style.position = 'relative';
    this.element.parentElement.style.overflow = 'hidden';

    // element styles
    this.element.style.position = 'absolute';
    this.element.style.top = this.top + '%' || '50%';
    this.element.style.left = this.left + '%' || '50%';

    this.element.style[this.cssProperty] = 'translate' + '( -50%, 0px )';
  }

  private evaluateScroll() {
    if (
      this.window.scrollY + this.window.outerHeight >
      this.element.parentElement.offsetTop
    ) {
      const calcVal =
        (this.window.scrollY - this.element.parentElement.offsetTop) *
        this.speed;
      const resultVal = 'translate' + '( -50%, ' + calcVal + 'px )';
      this.element.style[this.cssProperty] = resultVal;
    }
  }

  private setAspectRatio() {
    const parentAspectRatio =
      this.element.parentElement.offsetWidth /
      (this.element.parentElement.offsetHeight * (1 - (this.top / 100)));

    if (this.imgAspectRatio < parentAspectRatio) {
      this.element.style.width = '105%';
      this.element.style.height = 'auto';
    } else {
      this.element.style.width = 'auto';
      this.element.style.height = `${100 - this.top + 5}%`;
    }
  }
}
