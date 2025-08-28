# SRS Integration Guide for UniaoLives

This guide provides the necessary SRS (Simple-RTMP-Server) configuration to integrate with the UniaoLives platform.

## srs.conf

Below is a sample configuration for the `srs.conf` file. You should add this to your existing `srs.conf` or use it as a starting point.

```
# srs.conf

listen              1935;
max_connections     1000;
daemon              off;

http_api {
    enabled         on;
    listen          1985;
}

vhost uniaolives.com {
    http_hooks {
        enabled         on;
        on_publish      http://localhost:3000/api/srs;
        on_unpublish    http://localhost:3000/api/srs;
        on_play         http://localhost:3000/api/srs;
        on_stop         http://localhost:3000/api/srs;
    }
}
```

## Notes

-   **`vhost`**: The `vhost` name (`uniaolives.com` in this example) should match the vhost used in your RTMP stream URLs.
-   **`on_publish`**: This hook is used to authenticate streams. When a user starts streaming, SRS will send a POST request to this URL. The UniaoLives backend will then validate the stream key.
-   **`on_unpublish`**: This hook is called when a stream ends.
-   **`on_play`**: This hook is called when a viewer starts watching a stream.
-   **`on_stop`**: This hook is called when a viewer stops watching a stream.
-   **URL**: You must replace `http://localhost:3000` with the actual URL of your UniaoLives backend API. If your backend is running on a different port or domain, you need to update the URLs accordingly.
