import { trigger, state, style, transition, animate } from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
  state('out', style({ opacity: 0, maxHeight: '0', transform: 'translateY(-30px)' })),
  state('in', style({ opacity: 1, maxHeight: '500px', transform: 'translateY(0)' })),
  transition('out <=> in', animate('400ms ease-in-out')),
]);

export const fadeInOutZero = trigger('fadeInOutZero', [
  state('out', style({ opacity: 0, maxHeight: '0' })),
  state('in', style({ opacity: 1, maxHeight: '500px' })),
  transition('out <=> in', animate('400ms ease-in-out')),
]);

export const appearInOutOnEnterLeave = trigger('appearInOutOnEnterLeave', [
  state('void', style({ opacity: 0, height: '0', transform: 'translateY(-30px)' })),
  state('*', style({ opacity: 1, height: '*', transform: 'translateY(0)' })),
  transition('void => *', animate('300ms ease-out')),
  transition('* => void', animate('300ms ease-in')),
]);

export const appearInOut = trigger('appearInOut', [
  state('out', style({ opacity: 0, height: '0', transform: 'translateY(-30px)', overflowY: 'hidden' })),
  state('in', style({ opacity: 1, height: '*', transform: 'translateY(0)', overflowY: 'unset' })),
  transition('out => in', animate('300ms ease-out')),
  transition('in => out', animate('300ms ease-in')),
]);

export const fadeInOutOnEnterLeave = trigger('fadeInOutOnEnterLeave', [
  state('void', style({ opacity: 0 })),
  state('*', style({ opacity: '*' })),
  transition('void <=> *', animate('300ms ease-in-out')),
]);

export const expandCollapse = trigger('expandCollapse', [
  state('collapsed', style({ height: '0', overflow: 'hidden', opacity: '0' })),
  state('expanded', style({ height: '*', overflow: 'hidden', opacity: '1' })),
  transition('collapsed <=> expanded', [animate('300ms ease-in-out')]),
]);

export const expandCollapseOnEnterLeave = trigger('expandCollapseOnEnterLeave', [
  state('void', style({ height: '0', overflow: 'hidden', opacity: '0' })),
  state('*', style({ height: '*', overflow: 'hidden', opacity: '1' })),
  transition('void <=> *', animate('300ms ease-in-out')),
]);

export const fadeInOnEnter = trigger('fadeInOnEnter', [
  state('void', style({ opacity: 0 })),
  state('*', style({ opacity: '*' })),
  transition('void => *', animate('300ms ease-in')),
]);

// recreation of angular-material (14.2) animation for mat-error appearing
export const angularMaterialTransitionMessages = trigger('angularMaterialTransitionMessages', [
  state('void', style({ opacity: 0, transform: 'translateY(-5px)' })),
  state('*', style({ opacity: '*', transform: '*' })),
  transition('void => *', animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)')),
]);
