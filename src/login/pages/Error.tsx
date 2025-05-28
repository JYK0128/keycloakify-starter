import { Button } from '#/shadcn/components/ui';
import { kcSanitize } from 'keycloakify/lib/kcSanitize';
import type { PageProps } from 'keycloakify/login/pages/PageProps';
import type { KcContext } from '../KcContext';
import type { I18n } from '../i18n';

export default function ErrorPage(props: PageProps<Extract<KcContext, { pageId: 'error.ftl' }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { message, client, skipLink } = kcContext;

  const { msg } = i18n;

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={false}
      headerNode={msg('errorTitle')}
    >
      {/* 메시지 */}
      <p className="instruction" dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
      {/* 뒤로가기 */}
      {!skipLink && client !== undefined && client.baseUrl !== undefined && (
        <Button className="text-link font-bold" variant="ghost" asChild>
          <a href={client.baseUrl}>
            {msg('backToApplication')}
          </a>
        </Button>
      )}
    </Template>
  );
}
