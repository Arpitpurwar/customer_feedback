import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    return items.filter(item => (item.projectId.toLowerCase().includes(searchText.toString().toLowerCase())
      || item.projectName.toLowerCase().includes(searchText.toString().toLocaleLowerCase())));
  }
}
