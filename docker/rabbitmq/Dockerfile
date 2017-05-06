FROM rabbitmq:3.6-management

RUN rabbitmq-plugins enable rabbitmq_management_visualiser rabbitmq_tracing

HEALTHCHECK CMD ss -ln | awk '{print $5}' | grep ':5672'
