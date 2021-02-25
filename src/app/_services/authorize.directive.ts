import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { AuthorizationService } from './authorization.service';

@Directive({
    selector: '[authorize]'
})
export class AuthorizeDirective implements OnInit {
    @Input('authorize') permission: string; // Required permission passed in

    constructor(private el: ElementRef, private authorizationService: AuthorizationService) { }

    ngOnInit() {
        let permissions = this.permission? this.permission.split(',') : null;
        if (permissions && !this.authorizationService.hasPermissions(permissions)) {
            this.el.nativeElement.style.display = 'none';
        }
    }
}