import { DIALOG, DialogContext, DialogParams } from '#/customs/contexts/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '#/shadcn/components/ui';
import { PropsWithChildren, useCallback, useMemo, useState } from 'react';

// todo: useToast처럼 만들기
export function DialogProvider({ children }: PropsWithChildren) {
  const [open, setOpen] = useState<boolean>(false);
  const [type, setType] = useState<DialogParams['type']>(DIALOG.ALERT);
  const [title, setTitle] = useState<DialogParams['title']>('');
  const [description, setDescription] = useState<DialogParams['description']>('');
  const [result, setResult] = useState<DialogParams['result']>();
  const [resolver, setResolver] = useState<(value: unknown) => void>();

  /**
   * Dialog 호출 함수
   * - alert => true(확인)
   * - confirm => false(취소) / true(확인)
   * - error => false(확인)
   */
  const run = useCallback<DialogContext['run']>((params) => {
    return new Promise((resolve) => {
      setType(params.type);
      setTitle(
        params.title || {
          [DIALOG.ALERT]: '알림',
          [DIALOG.CONFIRM]: '확인',
          [DIALOG.ERROR]: '오류',
        }[params.type],
      );
      setDescription(params.description);
      setResult(params.result);
      setResolver(() => resolve);
      setOpen(true);
    });
  }, []);

  const handleModal = useCallback((open: boolean, value?: unknown) => {
    if (open) {
      // nothing
    }
    else {
      setOpen(false);
      if (resolver) resolver(value !== undefined ? value : false);
      setResolver(undefined);
    }
  }, [resolver]);

  const handleConfirm = useCallback(() => {
    const bool = type === DIALOG.ERROR ? false : true;
    const value = result !== undefined ? result : bool;
    handleModal(false, value);
  }, [type, handleModal, result]);

  const handleCancel = useCallback(() => {
    handleModal(false, false);
  }, [handleModal]);

  const value = useMemo<DialogContext>(() => ({
    run,
  }), [run]);

  return (
    <DialogContext.Provider value={value}>
      {children}
      <AlertDialog open={open} onOpenChange={handleModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {
              type === DIALOG.CONFIRM
              && (
                <AlertDialogCancel onClick={handleCancel}>
                  취소
                </AlertDialogCancel>
              )
            }
            <AlertDialogAction onClick={handleConfirm}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DialogContext.Provider>
  );
}
