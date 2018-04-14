import {Directive, ElementRef, HostListener, Input, OnInit, Renderer2} from '@angular/core';
import {NgModel} from '@angular/forms';

@Directive({
  selector: 'input[floatingLabel]',
  providers: [NgModel]
})
export class FloatingLabelDirective implements OnInit {
  @Input() floatingLabel: string;

  labelElement: any;
  hasInputValue: boolean;

  constructor(private renderer: Renderer2, private host: ElementRef, private ngModel: NgModel) { }

  @HostListener('focus') onFocus() {
    this.floatLabel(true);
  }

  @HostListener('blur') onBlur() {
    this.floatLabel(this.hasInputValue);
  }

  floatLabel(float: boolean): void {
    if (float) {
      this.renderer.removeClass(this.labelElement, 'label');
      this.renderer.addClass(this.labelElement, 'floated');
    } else {
      this.renderer.removeClass(this.labelElement, 'floated');
      this.renderer.addClass(this.labelElement, 'label');
    }
  }

  onChange(value: any): void {
    this.hasInputValue = value !== undefined && value !== null && value !== '' && (!Array.isArray(value) || value.length > 0);
    this.floatLabel(this.hasInputValue);
  }

  ngOnInit(): void {
    const parent = this.host.nativeElement.parentNode;

    const container = this.renderer.createElement('div');
    this.renderer.addClass(container, 'label-input-group');
    this.renderer.insertBefore(parent, container, this.host.nativeElement);

    this.labelElement = this.renderer.createElement('label');
    this.labelElement.innerHTML = this.floatingLabel;

    this.renderer.removeChild(parent, this.host.nativeElement);
    this.renderer.appendChild(container, this.host.nativeElement);
    this.renderer.appendChild(container, this.labelElement);

    this.floatLabel(false);

    this.labelElement.addEventListener('click', () => {
        this.host.nativeElement.focus();
    });

    this.ngModel.valueChanges.subscribe(x => this.onChange(x));
  }
}
