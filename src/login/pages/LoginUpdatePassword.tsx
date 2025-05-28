import { FormCheckbox, FormController, FormInput } from '#/customs';
import { Button } from '#/shadcn/components/ui';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: 'login-update-password.ftl' }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const form = useForm({
    defaultValues: {
      'password-new': '',
      'password-confirm': '',
      'logout-sessions': '',
    },
  });

  const { msg, msgStr } = i18n;

  const { url, messagesPerField, isAppInitiatedAction } = kcContext;

  useEffect(() => {
    if (messagesPerField.getFirstError('password', 'password-confirm')) {
      form.setError('password-new', { type: 'custom' });
      form.setError('password-confirm', {
        type: 'custom',
        message: messagesPerField.getFirstError('password', 'password-confirm'),
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!messagesPerField.existsError('password', 'password-confirm')}
      headerNode={msg('updatePasswordTitle')}
    >
      <FormController
        {...form}
        action={url.loginAction}
        method="post"
      >
        <FormInput
          showError
          orientation="vertical"
          type="password"
          control={form.control}
          name="password-new"
          autoFocus
          autoComplete="new-password"
          label={msg('passwordNew')}
        />
        <FormInput
          showError
          orientation="vertical"
          type="password"
          control={form.control}
          name="password-confirm"
          autoComplete="new-password"
          label={msg('passwordConfirm')}
        />
        <FormCheckbox
          orientation="horizontal"
          control={form.control}
          name="logout-sessions"
          label={msg('logoutOtherSessions')}
        />

        <div className="flex justify-end">
          {isAppInitiatedAction && (
            <Button
              type="submit"
              name="cancel-aia"
              value="true"
              variant="outline"
              formNoValidate
            >
              {msg('doCancel')}
            </Button>
          )}
          <Button type="submit">
            {msgStr('doSubmit')}
          </Button>
        </div>
      </FormController>
    </Template>
  );
}
