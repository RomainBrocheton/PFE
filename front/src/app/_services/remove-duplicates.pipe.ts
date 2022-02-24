import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeDuplicates',
  pure: false
})
export class RemoveDuplicatesPipe implements PipeTransform {

  transform(value: Array<any>, ...args: unknown[]): Array<any> {
    let uniqArray = [...new Set(value)];
    return uniqArray;
  }

}
