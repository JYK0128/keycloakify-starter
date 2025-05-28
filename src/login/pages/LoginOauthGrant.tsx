import { Button } from '#/shadcn/components/ui';
import { getKcClsx } from 'keycloakify/login/lib/kcClsx';
import { PageProps } from 'keycloakify/login/pages/PageProps';
import { KcContext } from '../KcContext';
import type { I18n } from '../i18n';

export default function LoginOauthGrant(props: PageProps<Extract<KcContext, { pageId: 'login-oauth-grant.ftl' }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, classes, Template } = props;
  const { url, oauth, client } = kcContext;

  const { msg, msgStr, advancedMsg, advancedMsgStr } = i18n;

  const { kcClsx } = getKcClsx({
    doUseDefaultCss,
    classes,
  });

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      bodyClassName="oauth"
      headerNode={(
        <>
          {client.attributes.logoUri && <img src={client.attributes.logoUri} />}
          <p>{client.name ? msg('oauthGrantTitle', advancedMsgStr(client.name)) : msg('oauthGrantTitle', client.clientId)}</p>
        </>
      )}
    >
      <h3>{msg('oauthGrantRequest')}</h3>
      <ul className="pl-4">
        {oauth.clientScopesRequested.slice(0, -1).map((clientScope) => (
          <li key={clientScope.consentScreenText}>
            {advancedMsg(clientScope.consentScreenText)}
            {clientScope.dynamicScopeParameter && (
              <>
                :
                {' '}
                <b>{clientScope.dynamicScopeParameter}</b>
              </>
            )}
          </li>
        ))}
      </ul>

      {client.attributes.policyUri
        || (client.attributes.tosUri && (
          <h3>
            {client.name ? msg('oauthGrantInformation', advancedMsgStr(client.name)) : msg('oauthGrantInformation', client.clientId)}
            {client.attributes.tosUri && (
              <>
                {msg('oauthGrantReview')}
                <Button className="text-link font-bold" variant="ghost" asChild>
                  <a href={client.attributes.tosUri} target="_blank" rel="noreferrer">
                    {msg('oauthGrantTos')}
                  </a>
                </Button>
              </>
            )}
            {client.attributes.policyUri && (
              <>
                {msg('oauthGrantReview')}
                <Button className="text-link font-bold" variant="ghost" asChild>
                  <a href={client.attributes.policyUri} target="_blank" rel="noreferrer">
                    {msg('oauthGrantPolicy')}
                  </a>
                </Button>
              </>
            )}
          </h3>
        ))}

      <form className="form-actions" action={url.oauthAction} method="POST">
        <input type="hidden" name="code" value={oauth.code} />
        <div className={kcClsx('kcFormGroupClass')}>
          <div id="kc-form-options">
            <div className={kcClsx('kcFormOptionsWrapperClass')} />
          </div>

          <div className="flex justify-end">
            <Button
              name="cancel"
              id="kc-cancel"
              variant="outline"
              type="submit"
            >
              {msgStr('doNo')}
            </Button>
            <Button
              name="accept"
              id="kc-login"
              type="submit"
            >
              {msgStr('doYes')}
            </Button>
          </div>
        </div>
      </form>
      <div className="clearfix" />
    </Template>
  );
}
