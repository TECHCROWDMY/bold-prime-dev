import { AbstractControl } from '@angular/forms';

export function emailValidator(control: AbstractControl) {

  var emailpattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

  var re = new RegExp(emailpattern);
  return re.test(control.value) || control.value == null || control.value.trim() == '' ? null : { validEmail: true };
}
