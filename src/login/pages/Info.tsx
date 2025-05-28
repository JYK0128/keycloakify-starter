import { Button } from '#/shadcn/components/ui';
import { kcSanitize } from 'keycloakify/lib/kcSanitize';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';

export default function Info(props: PageProps<Extract<KcContext, { pageId: 'info.ftl' }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { advancedMsgStr, msg } = i18n;

  const { messageHeader, message, requiredActions, skipLink, pageRedirectUri, actionUri, client } = kcContext;

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={false}
      headerNode={(
        <span
          dangerouslySetInnerHTML={{
            __html: kcSanitize(messageHeader ?? message.summary),
          }}
        />
      )}
    >
      <p dangerouslySetInnerHTML={{
        __html: kcSanitize(
          (() => {
            let html = message.summary?.trim();

            if (requiredActions) {
              html += '<b>';

              html += requiredActions.map((requiredAction) => advancedMsgStr(`requiredAction.${requiredAction}`)).join(', ');

              html += '</b>';
            }

            return html;
          })(),
        ),
      }}
      />
      {(() => {
        if (skipLink) {
          return null;
        }

        if (pageRedirectUri) {
          return (
            <Button className="text-link font-bold" variant="ghost" asChild>
              <a href={pageRedirectUri}>{msg('backToApplication')}</a>
            </Button>
          );
        }
        if (actionUri) {
          return (
            <Button className="text-link font-bold" variant="ghost" asChild>
              <a href={actionUri}>{msg('proceedWithAction')}</a>
            </Button>
          );
        }

        if (client.baseUrl) {
          return (
            <Button className="text-link font-bold" variant="ghost" asChild>
              <a href={client.baseUrl}>{msg('backToApplication')}</a>
            </Button>
          );
        }
      })()}
    </Template>
  );
}
