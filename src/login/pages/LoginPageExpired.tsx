import { Button } from '#/shadcn/components/ui';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';

export default function LoginPageExpired(props: PageProps<Extract<KcContext, { pageId: 'login-page-expired.ftl' }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { url } = kcContext;

  const { msg } = i18n;

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      headerNode={msg('pageExpiredTitle')}
    >
      <div>
        {msg('pageExpiredMsg1')}
        <Button className="text-link font-bold" variant="ghost" asChild>
          <a id="loginRestartLink" href={url.loginRestartFlowUrl}>
            {msg('doClickHere')}
          </a>
        </Button>
      </div>

      <div>
        {msg('pageExpiredMsg2')}
        <Button className="text-link font-bold" variant="ghost" asChild>
          <a id="loginContinueLink" href={url.loginAction}>
            {msg('doClickHere')}
          </a>
        </Button>
      </div>
    </Template>
  );
}
