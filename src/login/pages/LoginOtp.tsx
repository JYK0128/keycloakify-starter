import { FormController, FormInput, FormRadioGroup } from '#/customs';
import { Button } from '#/shadcn/components/ui';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';

export default function LoginOtp(props: PageProps<Extract<KcContext, { pageId: 'login-otp.ftl' }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const form = useForm({
    defaultValues: {
      selectedCredentialId: '',
      otp: '',
    },
  });

  const { otpLogin, url, messagesPerField } = kcContext;

  const { msg, msgStr } = i18n;

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (messagesPerField.getFirstError('totp')) {
      form.setError('otp', {
        type: 'custom',
        message: messagesPerField.get('totp'),
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
      displayMessage={!messagesPerField.existsError('totp')}
      headerNode={msg('doLogIn')}
    >
      <FormController
        {...form}
        action={url.loginAction}
        onSubmit={() => {
          setIsSubmitting(true);
          return true;
        }}
        method="post"
      >
        <FormRadioGroup
          {...form}
          name="selectedCredentialId"
          items={otpLogin.userOtpCredentials
            .map(({ userLabel, id }) => ({ label: userLabel, value: id }))}
        />

        <FormInput
          {...form}
          orientation="vertical"
          label={msg('loginOtpOneTime')}
          name="otp"
          showError
          autoComplete="off"
          autoFocus
        />

        <div className="flex justify-end">
          <Button name="login" type="submit" disabled={isSubmitting}>
            {msgStr('doLogIn')}
          </Button>
        </div>
      </FormController>
    </Template>
  );
}
