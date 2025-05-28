import { Button } from '#/shadcn/components/ui';
import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';

export default function Terms(props: PageProps<Extract<KcContext, { pageId: 'terms.ftl' }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  const { msg, msgStr } = i18n;

  const { url } = kcContext;

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={false}
      headerNode={msg('termsTitle')}
    >
      <div id="kc-terms-text">{msg('termsText')}</div>
      <form className="form-actions" action={url.loginAction} method="POST">
        <div className="flex justify-end">
          <Button name="cancel" type="submit" variant="outline">
            {msgStr('doDecline')}
          </Button>
          <Button name="accept" type="submit">
            {msgStr('doAccept')}
          </Button>
        </div>
      </form>
    </Template>
  );
}
