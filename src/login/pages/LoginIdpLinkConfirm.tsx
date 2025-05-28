import { FormController } from '#/customs';
import { Button } from '#/shadcn/components/ui';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import { useForm } from 'react-hook-form';
import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';

export default function LoginIdpLinkConfirm(props: PageProps<Extract<KcContext, { pageId: 'login-idp-link-confirm.ftl' }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const form = useForm();
  const { url, idpAlias } = kcContext;

  const { msg } = i18n;

  return (
    <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg('confirmLinkIdpTitle')}>
      <FormController
        {...form}
        action={url.loginAction}
        method="post"
      >
        <div className="flex justify-end">
          <Button
            type="submit"
            name="submitAction"
            value="linkAccount"
            variant="outline"
          >
            {msg('confirmLinkIdpContinue', idpAlias)}
          </Button>
          <Button
            type="submit"
            name="submitAction"
            value="updateProfile"
          >
            {msg('confirmLinkIdpReviewProfile')}
          </Button>
        </div>
      </FormController>
    </Template>
  );
}
