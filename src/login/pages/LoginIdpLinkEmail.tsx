import { Button } from '#/shadcn/components/ui';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';

export default function LoginIdpLinkEmail(props: PageProps<Extract<KcContext, { pageId: 'login-idp-link-email.ftl' }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { url, realm, brokerContext, idpAlias } = kcContext;

  const { msg } = i18n;

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg('emailLinkIdpTitle', idpAlias)}
    >
      <ul className="[&>li]:pb-4">

        <li>
          <p id="instruction1">
            {msg('emailLinkIdp1', idpAlias, brokerContext.username, realm.displayName)}
          </p>
        </li>
        <li>
          <p id="instruction2">
            {msg('emailLinkIdp2')}
            {' '}
            <Button className="text-link font-bold" variant="ghost" asChild>
              <a href={url.loginAction}>{msg('doClickHere')}</a>
            </Button>
            {' '}
            {msg('emailLinkIdp3')}
          </p>
        </li>
        <li>
          <p id="instruction3">
            {msg('emailLinkIdp4')}
            {' '}
            <Button className="text-link font-bold" variant="ghost" asChild>
              <a href={url.loginAction}>{msg('doClickHere')}</a>
            </Button>
            {' '}
            {msg('emailLinkIdp5')}
          </p>
        </li>
      </ul>
    </Template>
  );
}
