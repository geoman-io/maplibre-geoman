export type BaseFwdEvent<T extends { actionType: string; action: string }> = {
  name: string;
} & Pick<T, 'actionType' | 'action'>;
