import { FormController, FormInput } from '#/customs';
import { Button } from '#/shadcn/components/ui';
import { PageProps } from 'keycloakify/login/pages/PageProps';
import { useForm } from 'react-hook-form';
import { KcContext } from '../KcContext';
import type { I18n } from '../i18n';

export default function LoginOauth2DeviceVerifyUserCode(
  props: PageProps<Extract<KcContext, { pageId: 'login-oauth2-device-verify-user-code.ftl' }>, I18n>,
) {
  const { kcContext, i18n, doUseDefaultCss, classes, Template } = props;
  const { url } = kcContext;

  const { msg, msgStr } = i18n;

  const form = useForm({
    defaultValues: {
      device_user_code: '',
    },
  });

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg('oauth2DeviceVerificationTitle')}
    >

      <FormController
        {...form}
        action={url.oauth2DeviceVerificationAction}
        method="post"
      >
        <FormInput
          orientation="vertical"
          label={msg('verifyOAuth2DeviceUserCode')}
          control={form.control}
          name="device_user_code"
          autoComplete="off"
          type="text"
          autoFocus
        />

        <div className="flex justify-end">
          <Button type="submit">
            {msgStr('doSubmit')}
          </Button>
        </div>
      </FormController>
    </Template>
  );
}
