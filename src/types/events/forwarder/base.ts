export type BaseFwdEvent<T extends { actionType: string; action: string }> = {
  type: string;
} & Pick<T, 'actionType' | 'action'>;
