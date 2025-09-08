import { ToastrService } from "ngx-toastr";
import {
  Directive,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from "@angular/core";

@Directive({
  selector: '[appCopyClipboard]'
})
export class CopyClipboardDirective {
  constructor(private toastrService: ToastrService) { }
  @Input("appCopyClipboard")
  public payload?: string;
  @Input("context")
  public context?: string;
  @Output("copied")
  public copied: EventEmitter<string> = new EventEmitter<string>();
  @HostListener("click", ["$event"])
  public onClick(event: MouseEvent): void {
    event.preventDefault();
    if (!this.payload) return;

    if (this.isSafari()) {
      const el = document.createElement('input');
      el.value = this.payload;
      document.body.appendChild(el);
      this.toastrService.success("Copied Successfully");
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    else {
      const listener = (e: ClipboardEvent) => {

        const clipboard = e.clipboardData || (window as { [key: string]: any }) ['clipboardData'] ;
        clipboard.setData('text', this?.payload?.toString());
        this.toastrService.success("Copied Successfully");
        e.preventDefault();
        this.copied.emit(this.payload);
      };
      document.addEventListener("copy", listener, false);
      try {
        document.execCommand("copy");
      } catch (err) {
        console.log(err);
      }
      document.removeEventListener("copy", listener, false);
    }
  }
  isSafari() {
    return navigator.userAgent.match(/ipad|iphone|safari/i);
  }
}

