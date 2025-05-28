import { FormController, FormInput } from '#/customs';
import { Button } from '#/shadcn/components/ui';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: 'login-reset-password.ftl' }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
  const { url, realm, auth, messagesPerField } = kcContext;

  const form = useForm({
    defaultValues: {
      username: auth.attemptedUsername ?? '',
    },
  });

  const { msg, msgStr } = i18n;

  useEffect(() => {
    if (messagesPerField.existsError('username')) {
      form.setError('username', {
        type: 'custom',
        message: messagesPerField.getFirstError('username'),
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
      displayInfo
      displayMessage={!messagesPerField.existsError('username')}
      infoNode={realm.duplicateEmailsAllowed ? msg('emailInstructionUsername') : msg('emailInstruction')}
      headerNode={msg('emailForgotTitle')}
    >
      <FormController
        {...form}
        action={url.loginAction}
        method="post"
      >
        <FormInput
          showError
          control={form.control}
          name="username"
          orientation="vertical"
          label={!realm.loginWithEmailAllowed
            ? msg('username')
            : !realm.registrationEmailAsUsername
              ? msg('usernameOrEmail')
              : msg('email')}
          autoFocus
        />

        {/* 뒤로가기 */}
        <Button className="text-link font-bold" variant="ghost" asChild>
          <a href={url.loginUrl}>
            {msg('backToLogin')}
          </a>
        </Button>


        {/* 확인 */}
        <Button
          className="w-full"
          type="submit"
          autoFocus
        >
          {msgStr('doSubmit')}
        </Button>
      </FormController>
    </Template>
  );
}
