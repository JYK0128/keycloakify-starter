import { FormController } from '#/customs';
import { Button } from '#/shadcn/components/ui';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { useForm } from 'react-hook-form';
import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';

export default function LoginIdpLinkConfirmOverride(props: PageProps<Extract<KcContext, { pageId: 'login-idp-link-confirm-override.ftl' }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const form = useForm();

  const { url, idpDisplayName } = kcContext;

  const { msg } = i18n;

  return (
    <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg('confirmOverrideIdpTitle')}>
      <FormController
        {...form}
        action={url.loginAction}
        method="post"
      >
        {msg('pageExpiredMsg1')}
        {' '}

        <Button className="text-link font-bold self-start" variant="ghost" asChild>
          <a id="loginRestartLink" href={url.loginRestartFlowUrl}>
            {msg('doClickHere')}
          </a>
        </Button>
        <br />
        <br />
        <Button
          type="submit"
          name="submitAction"
          id="confirmOverride"
          value="confirmOverride"
        >
          {msg('confirmOverrideIdpContinue', idpDisplayName)}
        </Button>
      </FormController>
    </Template>
  );
}
