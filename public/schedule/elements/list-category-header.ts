import { Slim } from '../node_modules/slim-js/Slim.js';
import { tag, template } from '../node_modules/slim-js/Decorators.js';

@tag("list-category-header")
@template(`
    <div class="list_item_category_header" bind>
    {{title}}
    </div>
`)
export class ListCategoryHeader extends Slim {
    title : string;

    constructor(name : string) {
        super();
        this.title = name;
    }
}