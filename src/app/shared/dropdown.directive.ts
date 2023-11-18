import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[appDropDown]'
})
export class DropdownDirective {
  constructor(private elementReference: ElementRef) {}

  @HostBinding('class.open') isOpen;

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.elementReference.nativeElement.contains(event.target)
      ? !this.isOpen
      : false;
  }
}
