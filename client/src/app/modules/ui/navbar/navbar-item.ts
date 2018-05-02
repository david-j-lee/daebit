import { Modules } from 'ui/navbar/navbar.service';

export class NavbarItem {
    module: Modules;
    icon: string;
    text: string;
    link: string;
    isActive: boolean;
}
